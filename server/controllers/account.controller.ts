import { Account } from '@entities/account';
import { VerifyAccountEnquiryRequest } from '@models/verify/request';
import { VerifyAccountEnquiryResponsePayload, VerifyResponse } from '@models/verify/response';
import { AccountRepository } from '@repository/implementation/account-repository';
import { EnvConstants } from '@services/implementation/common/env.constants';
import UtilService from '@services/implementation/common/util';
import { GET, POST, route } from 'awilix-express';
import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import { VerifyVerificationStatus } from '@enums/verify/verification-status';
import RedisMiddleware from 'server/middleware/redis-middleware';
import { VerifyVerificationType } from '@enums/verify/verification-type';
import { Customer } from '@entities/customer';
import { VanaheimBodyRequest } from '@models/express/request';
import { VanaheimTypedResponse } from '@models/express/response';

// const accountList:any={};
@route('/api/account')
export default class AccountController {

  accountEnquiryInstance = axios.create({
    method: 'post',
    baseURL: EnvConstants.verify.v3.baseUrl,
    timeout:120000,
    headers: { 'Content-Type': 'application/json', 'apiKey': EnvConstants.verify.v3.accountInquiry.apiKey, 'userid': EnvConstants.verify.v3.accountInquiry.userId }, //,'accountNumber':body.accountNumber,'bankcode':key},
  });

  constructor(private _utils: UtilService, private _redis: RedisMiddleware, private _accountRepository: AccountRepository) {

  }

  getAccountName(data: VerifyAccountEnquiryResponsePayload | any) {
    console.log("Account Info",data)
    return data.full_name //?? (!data["surname"] && !data["otherNames"])?"": (data["surname"]??"" + " " + data["otherNames"]??"");
  }
  @route('/enquiry')
  @POST()
  enquiry = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>,  next: any) => {
    let cacheKey = "accountList";
    let accountList: any = await this._redis.get(cacheKey, {});
    if (this._utils.verifyRequest(req, "accountenquiry") && this._utils.spamChecker(req.ip, "accountenquiry")) {
      try {
        let endpoint = EnvConstants.verify.v3.accountInquiry.endpoint;
        let body: VerifyAccountEnquiryRequest = { bankCode: req.body.bankcode, searchParameter: req.body.accountnumber, verificationType: VerifyVerificationType.AccountEnquiry, transactionReference: "" };
        const key = `${body.bankCode}-${body.searchParameter}`;
        // console.log(accountList, accountList[key])
        if (!this._utils.hasValue(accountList[key])) {
          let result = await this.accountEnquiryInstance.post<VerifyAccountEnquiryRequest, AxiosResponse<VerifyResponse<VerifyAccountEnquiryResponsePayload>>>(endpoint, body);

          console.log("Fetch Account Result", result?.data);
          if (this._utils.hasValue(result.data) && result.data.responseCode == "00") {

            accountList[key] = result.data.response || VerifyVerificationStatus.NotVerified;
          }

          if (result.data.responseCode == "00" && result.data.verificationStatus == VerifyVerificationStatus.Verified) {

            res.payload = { message: "Account Enquiry was successful", data: this.getAccountName(result.data.response) };
            res.statusCode = 200;
          } else {
            res.statusCode = 400;
            res.payload = { message: "Account Enquiry was not successful" };
          }

        }
        else {
          console.log("Cached Result", accountList[key]);
          if (accountList[key] == VerifyVerificationStatus.NotVerified) {
            res.statusCode = 400;
            res.payload = { message: "Account Enquiry was not successful" };
          } else {
            res.payload = { message: "Account Enquiry was successful", data: this.getAccountName(accountList[key]) };
            res.statusCode = 200;
          }
        }
      }
      catch (err: any) {
        res.payload = { message: "Account Enquiry was not successful" };
        res.statusCode = 500;
        console.log(err);
      }
    } else {
      res.payload = { message: "Sorry we can not process your request at the moment. Kindly contact our support team." };
      res.statusCode = 400;
    }
    await this._redis.save(cacheKey, accountList);
    next();
  }


  @route('/')
  @GET()
  accounts = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
    try {
      let customer = req.session?.userData?.customer as Customer;
      if (customer) {
        let accounts = await this._accountRepository.getByCustomerID(customer.id);
        res.statusCode = 200;
        res.payload = {data:accounts.length == 0 ? {} : accounts};
      } else {
        res.statusCode = 400;
        res.payload = { message: "Not a customer" }

      }
    }
    catch (err: any) {
      res.statusCode = 400;
      res.payload = { message: "Failed to get accounts" }
    }
    next();
  }
  @route('/updateAccounts')
  @POST()
  updateAccounts = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
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
        res.payload = { message: "Successfully Updated" };
      } else {
        res.statusCode = 400;
        res.payload = { message: "Not a customer" }

      }
    }
    catch (err: any) {
      res.statusCode = 400;
      res.payload = { message: "Failed to get accounts" }
    }
    next();
  }
}


// type VerifyAccountEnquiryRequest = {
//   transactionReference: string
//   searchParameter: string
//   bankCode: string
//   verificationType: VerifyVerificationType
// }

// type VerifyAccountEnquiryResponse = {
//   responseCode: string,
//   description: string,
//   verificationType: VerifyVerificationType,
//   verificationStatus: VerifyVerificationStatus,
//   transactionStatus: string,
//   transactionReference: string,
//   transactionDate: string,
//   searchParameter: string,
//   response: VerifyAccountEnquiryResponsePayload,
//   faceMatch: string,
// }
// type VerifyAccountEnquiryResponsePayload = {

//   full_name: string,
//   bank_name: string,
//   account_number: string,
//   bank_code: string,
//   message: string,

// }
// enum VerifyVerificationType {
//   AccountEnquiry = "ACCOUNT-INQUIRY-VERIFICATION"
// }

// enum VerifyVerificationStatus {
//   Verified = "VERIFIED",
//   NotVerified = "NOT VERIFIED"
// }