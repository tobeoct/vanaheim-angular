import AppConfig from "@api/config";
import { Account } from "@models/account";
import { Customer } from "@models/customer";
import { EarningRequestStatus } from "@models/helpers/enums/investmentrequeststatus";
import { BaseStatus } from "@models/helpers/enums/status";
import { EarningPayload } from "@models/investment/investment-payload";
import { EarningRequest } from "@models/investment/investment-request";
import { EarningRequestLog } from "@models/investment/investment-request-log";
import { IAccountRepository } from "@repository/interface/Iaccount-repository";
import { IEarningRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";
import { IEarningRequestRepository } from "@repository/interface/investment/Iinvestment-request-repository";
import { IAccountService } from "@services/interfaces/Iaccount-service";
import { IEarningService } from "@services/interfaces/investment/Iinvestmentservice";
import EmailService, { EmailType } from "../common/email-service";
import { TemplateService } from "../common/template-service";
import UtilService from "../common/util";
const MAX_ACTIVE_REQUESTS = 5;
export class EarningService implements IEarningService {
  constructor(private _appConfig: AppConfig, private Op: any, private _earningRequestRepository: IEarningRequestRepository, private _earningRequestLogRepository: IEarningRequestLogRepository, private _accountRepository: IAccountRepository, private _accountService: IAccountService, private _templateService: TemplateService, private _emailService: EmailService, private _utils: UtilService) {

  }
  getAllEarningRequests: () => Promise<EarningRequest[]>;
  getAllEarningRequestLogs: () => Promise<EarningRequestLog[]>;
  getEarningRequestById: () => Promise<EarningRequest>;
  getEarningRequestLogById: () => Promise<EarningRequestLog>;
  updateEarningRequest: (investmentRequest: EarningRequest) => Promise<EarningRequest>;


  restructure: (disbursedEarningId: number, repayment: number) => Promise<boolean>;

  process = (customer: Customer, payload: EarningPayload) => new Promise<any>(async (resolve, reject) => {
    try {
      const email = customer.email;
      const name = customer.firstName;
      const { payout, duration, rate, maturity, amount, type } = payload;
      await this.validateRequest(customer.id);
      const request = await this.createEarningRequest(payload, customer.id);
      const requestLog = await this.createEarningRequestLog(request);
      const customerTemplate = this._templateService.INVESTMENT_CUSTOMER_TEMPLATE((!name) ? "Customer" : `${this._utils.titleCase(name)}`);
      const adminTemplate = this._templateService.INVESTMENT_ADMIN_TEMPLATE(name, email, this._utils.currencyFormatter(this._utils.convertToPlainNumber(amount)), duration.toString() + " Months", maturity, this._utils.currencyFormatter(payout), rate, type);
      await this._emailService.SendEmail({ type: EmailType.Earning, to: email, filePaths: [`dist/vanaheim/assets/static/VANIR CAPITAL GLOBAL PITCH DECK_Vol 4.pdf`], html: customerTemplate, toCustomer: true })

      await this._emailService.SendEmail({ type: EmailType.Earning, to: this._appConfig.INVESTMENT_EMAIL, html: adminTemplate, toCustomer: false });

      resolve({ status: true, data: { message: "Thanks for indicating your interest in earnings 😊" } });

    }
    catch (err) {
      console.log("Earning Service: ", err);
      resolve({ status: false, data: "Sorry we can not process your request at the moment. Kindly contact our support team." });
    }
  })

  validateRequest = (customerID: number) => {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const activeRequests = await this._earningRequestRepository.getEarningByStatus(customerID, { [this.Op.not]: EarningRequestStatus.NotQualified })
        if (activeRequests.length >= MAX_ACTIVE_REQUESTS) reject("You have currently reached your maximum earnings request limit");
        resolve(true);
      } catch (err) {
        console.log("Validate Request: ", err);
        reject(err);
      }
    })
  }
  createEarningRequest = (payload: EarningPayload, customerID: number) => {

    return new Promise<EarningRequest>(async (resolve, reject) => {
      try{
      let investment = new EarningRequest();
      let declinedRequests = await this._earningRequestRepository.getEarningByStatus(customerID, EarningRequestStatus.NotQualified);
      if (declinedRequests.length > 0) {
        investment = Object.assign(investment, (declinedRequests[0] as any).dataValues);
      }
      investment.type = payload.type;
      investment.duration = payload.duration;
      investment.amount = this._utils.convertToPlainNumber(payload.amount);
      investment.code = this._utils.autogenerate({ prefix: "ERN" });
      investment.requestStatus = EarningRequestStatus.Pending;
      investment.status = BaseStatus.Active;
      investment.requestId = investment.code;
      investment.rate = payload.rate;
      if (!payload.accountInfo) throw "Please specify an account";
      if (payload.accountInfo?.id) {
        let account = await this._accountRepository.getById(payload.accountInfo?.id);
        if (account || Object.keys(account).length > 0) throw "Invalid Account Specified";
        account = (account as any).dataValues as Account;
        investment.account = account;
        investment.accountID = payload.accountInfo.id;
      } else {
        const account = await this._accountService.createAccount(customerID, payload.accountInfo);
        investment.accountID = account.id;
      }
      investment.customerID = customerID;
      investment.requestDate = new Date();
      if (investment.id) {
        await this._earningRequestRepository.update(investment);
        resolve(investment);
      } else {
        resolve(await this._earningRequestRepository.create(investment));
      }
    }catch(err){
      console.log("Create Investment Request:",err);
      reject(err);
    }
    })
  }

  createEarningRequestLog = (request: EarningRequest) => {
    return new Promise<EarningRequest>(async (resolve, reject) => {

      let investmentRequestLog = Object.assign({}, request as EarningRequestLog);
      try {
        investmentRequestLog.id = 0;
        investmentRequestLog.investmentRequestID = request.id;
        console.log("Earning REQUEST LOG", investmentRequestLog, request)
        resolve(await this._earningRequestLogRepository.create(investmentRequestLog));
      } catch (err) {
        console.log(err);
        resolve(await this._earningRequestLogRepository.create(investmentRequestLog));

      }
    });
  }

}