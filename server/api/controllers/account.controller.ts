import { Account } from '@models/account';
import { Customer } from '@models/customer';
import { AccountRepository } from '@repository/implementation/account-repository';
import UtilService from '@services/implementation/common/util';
import { GET, POST, route, before, PUT } from 'awilix-express';
import axios from 'axios';
import RedisMiddleware from 'server/middleware/redis-middleware';
const expAutoSan = require('express-autosanitizer');

// const accountList:any={};
@route('/api/account')
export default class AccountController {

  accountEnquiryInstance = axios.create({
    method: 'post',
    baseURL: 'https://app.verified.ng',
    timeout: 60000,
    headers: { 'Content-Type': 'application/json', 'api-key': "7UBUKPMxF8i99DgB", 'userid': '1543318849803' }, //,'accountNumber':body.accountNumber,'bankcode':key},
  });

  constructor(private _utilService: UtilService, private _redis: RedisMiddleware, private _accountRepository: AccountRepository) {

  }

  getAccountName(data: any) {
    //"inquiry":{"status":"00","accountNumber":"0801850608","otherNames":"TOBECHUKWU","surname":"ONYEMA","bvn":null,"bankCode":"044"}
    return data["surname"] + " " + data["otherNames"];
  }
  @route('/enquiry')
  @POST()
  enquiry = async (req: any, res: any, next: any) => {
    let accountNumber;
    let cacheKey = "accountList";
    let accountList: any = await this._redis.get(cacheKey, {});
    if (this._utilService.verifyRequest(req, "accountenquiry") && this._utilService.spamChecker(req.ip, "accountenquiry")) {
      try {
        let url = '/inquiry/api/sacctinq/bvn/wrapper';
        let body = { bankCode: req.body.bankcode, accountNumber: req.body.accountnumber };
        accountNumber = body.accountNumber;
        const key = `${body.bankCode}-${body.accountNumber}`;
        if (!this._utilService.hasValue(accountList[key])) {
          let result = await this.accountEnquiryInstance.post(url, body);

          console.log("Fetch Result");
          if (this._utilService.hasValue(result.data["inquiry"]) && result.data["inquiry"]["status"] == "00") {

            accountList[key] = result.data["inquiry"];
          }

          if (result.data["inquiry"]["status"] == "00") {

            res.data = { message: "Account Enquiry was successful", data: this.getAccountName(result.data["inquiry"]) };
            res.statusCode = 200;
          } else {
            res.statusCode = 400;
            res.data = { message: "Account Enquiry was not successful" };
          }

        }
        else {
          console.log("Cached Result");
          res.data = { message: "Account Enquiry was successful", data: this.getAccountName(accountList[key]) };
          res.statusCode = 200;
        }
      }
      catch (err) {
        res.data = { message: "Account Enquiry was not successful" };
        res.statusCode = 500;
        console.log(err);
      }
    } else {
      res.data = { message: "Sorry we can not process your request at the moment. Kindly contact our support team." };
      res.statusCode = 400;
    }
    await this._redis.save(cacheKey, accountList);
    next();
  }


  @route('/')
  @GET()
  accounts = async (req: any, res: any, next: any) => {
    try {
      let customer = req.session?.userData?.customer as Customer;
      if (customer) {
        let accounts = await this._accountRepository.getByCustomerID(customer.id);
        res.statusCode = 200;
        res.data = accounts.length == 0 ? {} : accounts;
      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Not a customer" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get accounts" }
    }
    next();
  }
  @route('/updateAccounts')
  @POST()
  updateAccounts = async (req: any, res: any, next: any) => {
    try {
      let accounts: any[] = req.body.accounts;
      if (accounts) {
        accounts.forEach(async account => {
          let accInDb = await this._accountRepository.getById(account.id);
          accInDb = accInDb.dataValues as Account;
          accInDb.number = account.accountNumber;
          accInDb.name = account.accountName;
          accInDb.bank = account.bank;
          this._accountRepository.update(accInDb);
        })
        res.statusCode = 200;
          res.data = {status:true,response: "Successfully Updated"};
      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Not a customer" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get accounts" }
    }
    next();
  }
}