import { HttpResponseBase } from "@angular/common/http";
import AppConfig from "@api/config";
import { Account } from "@models/account";
import { Customer } from "@models/customer";
import { ApprovedEarningStatus } from "@models/helpers/enums/approvedEarningStatus";
import { EarningType } from "@models/helpers/enums/earningtype";
import { EarningRequestStatus } from "@models/helpers/enums/investmentrequeststatus";
import { BaseStatus } from "@models/helpers/enums/status";
import { ApprovedEarning } from "@models/investment/approved-investment";
import { EarningLiquidation, LiquidationStatus } from "@models/investment/earnings-liquidation";
import { EarningTopUp, TopUpStatus } from "@models/investment/earnings-topup";
import { EarningPayload } from "@models/investment/investment-payload";
import { EarningRequest } from "@models/investment/investment-request";
import { EarningRequestLog } from "@models/investment/investment-request-log";
import { SearchResponse } from "@models/search-response";
import { WebNotification, WebNotData } from "@models/webnotification";
import { IAccountRepository } from "@repository/interface/Iaccount-repository";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { IApprovedEarningRepository } from "@repository/interface/investment/Iapproved-earning-repository";
import { IEarningLiquidationRepository } from "@repository/interface/investment/Iearning-liquidation-repository";
import { IEarningPayoutRepository } from "@repository/interface/investment/Iearning-payout-repository";
import { IEarningTopUpRepository } from "@repository/interface/investment/Iearning-topup-repository";
import { IEarningRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";
import { IEarningRequestRepository } from "@repository/interface/investment/Iinvestment-request-repository";
import { IAccountService } from "@services/interfaces/Iaccount-service";
import { INotificationService } from "@services/interfaces/Inotification-service";
import { IApprovedEarningService } from "@services/interfaces/investment/Iapproved-earning-service";
import { IEarningRequestLogService } from "@services/interfaces/investment/Iinvestment-log-request-service";
import { IEarningService } from "@services/interfaces/investment/Iinvestmentservice";
import moment = require("moment");
import { BaseResponse } from "../base-service";
import EmailService, { EmailType } from "../common/email-service";
import { EnvConstants } from "../common/env.constants";
import { TemplateService } from "../common/template-service";
import UtilService from "../common/util";
export class EarningService implements IEarningService {
  constructor(private _db: any, private _appConfig: AppConfig,private _earningPayOutRepository:IEarningPayoutRepository, private _earningTopUpRepository: IEarningTopUpRepository, private _earningLiquidationRepository: IEarningLiquidationRepository, private _approvedEarningService: IApprovedEarningService, private _approvedEarningRepository: IApprovedEarningRepository, private Op: any, private _notificationService: INotificationService, private _customerRepository: ICustomerRepository, private _earningRequestLogService: IEarningRequestLogService, private _earningRequestRepository: IEarningRequestRepository, private _earningRequestLogRepository: IEarningRequestLogRepository, private _accountRepository: IAccountRepository, private _accountService: IAccountService, private _templateService: TemplateService, private _emailService: EmailService, private _utils: UtilService) {

  }
  MGT_FEE: number = 5 / 100;
  TAX: number = 10 / 100
  processEarningRequest: (request: any, userData: any) => Promise<EarningRequest>;
  getAllEarningRequests: () => Promise<EarningRequest[]>;
  getAllEarningRequestLogs: () => Promise<EarningRequestLog[]>;
  getEarningRequestById: () => Promise<EarningRequest>;
  getEarningRequestLogById: () => Promise<EarningRequestLog>;
  restructure: (disbursedEarningId: number, repayment: number) => Promise<boolean>;
  topUp = (id: number) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let earningTopUp: EarningTopUp = await this._earningTopUpRepository.getByIdWithInclude(id, [{ model: this._db.ApprovedEarning, required: true }]);
        if (!earningTopUp || Object.keys(earningTopUp).length == 0) {
          resolve({ status: false, data: "Cannot find Top Up request" });
          return;
        }
        console.log(earningTopUp);
        earningTopUp = (earningTopUp as any).dataValues as EarningTopUp;
        earningTopUp.topUpStatus = TopUpStatus.Processed;
        const amount = (+earningTopUp.amount);
        let approvedEarning: ApprovedEarning = earningTopUp.ApprovedEarning
        if (!approvedEarning || Object.keys(approvedEarning).length == 0) {

          resolve({ status: false, data: "Cannot find approved request" });
          return;
        }
        approvedEarning = (approvedEarning as any).dataValues as ApprovedEarning;


        let earningRequest: EarningRequest = await this._earningRequestRepository.getById(approvedEarning.earningRequestID);
        if (!earningRequest || Object.keys(earningRequest).length == 0) {
          resolve({ status: false, data: "Cannot find earning request" });
          return;
        }
        earningRequest = (earningRequest as any).dataValues as EarningRequest;
        let earningRequestLog: EarningRequestLog = await this._earningRequestLogRepository.getById(approvedEarning.earningRequestLogID);
        if (!earningRequestLog || Object.keys(earningRequestLog).length == 0) {
          resolve({ status: false, data: "Cannot find earning log request" });
          return;
        }
        earningRequestLog = (earningRequestLog as any).dataValues as EarningRequestLog;

        if (earningRequest.requestStatus == EarningRequestStatus.TopUpRequest) {
          const duration = moment(earningRequestLog.maturityDate).diff(moment().endOf("month"), "month")
          const payout = this.calculateTotalPayout(amount, earningRequest.rate, duration);
          earningRequest.topUpPayout = (earningRequest.topUpPayout ?? 0) + payout;
          earningRequest.topUp = (earningRequest.topUp ?? 0) + amount;

          earningRequest.requestStatus = EarningRequestStatus.Active;
          const newPrincipal =  (+earningRequest.amount) + (+amount);
          const newPayout =  (+earningRequest.payout) + (+payout);
          const payoutsSoFar = await this._earningPayOutRepository.getPayoutSoFar(approvedEarning.id);
          const newRemaining = newPayout - (payoutsSoFar[0]?.total??0);
          const newMonthlyPayment = newRemaining/duration;
          earningRequest.amount= newPrincipal;
          earningRequest.payout = newPayout;
          earningRequest.monthlyPayment = newMonthlyPayment;
          earningRequest.requestStatus = EarningRequestStatus.Active;

          earningRequestLog.requestStatus = EarningRequestStatus.Active;
          earningRequestLog.topUpPayout = (earningRequestLog.topUpPayout ?? 0) + payout;
          earningRequestLog.topUp = (earningRequestLog.topUp ?? 0) + amount;

          earningRequestLog.amount= newPrincipal;
          earningRequestLog.payout = newPayout;
          earningRequestLog.monthlyPayment = newMonthlyPayment;

          earningTopUp.topUpStatus = TopUpStatus.Processed;
          await this._earningTopUpRepository.update(earningTopUp);
          await this._earningRequestRepository.update(earningRequest);
          await this._earningRequestLogRepository.update(earningRequestLog);
          resolve({ status: true, data: "Top Up successful" });
        } else {
          resolve({ status: false, data: "Top Up was not requested" });

        }
      }
      catch (err) {
        console.log("Earning Service Top Up: ", err);
        resolve({ status: false, data: err ?? "Sorry we can not process your request at the moment. Kindly contact our support team." });
      }
    })
  }


  getInterest(amount: number, rate: number, duration: number) {
    return this.calculatePayout(amount, rate, duration) - this._utils.convertToPlainNumber(amount);
  }
  calculatePayout(amount: number, rate: number, duration: number) {
    return this._utils.convertToPlainNumber(amount) + ((((rate / 12) / 100) * this._utils.convertToPlainNumber(amount)) * duration);
  }
  calculateTotalPayout(amount: number, rate: number, duration: number) {
    const tax = (this.getInterest(amount, rate, duration) * this.TAX);
    const mgtFee = this._utils.convertToPlainNumber(amount) * this.MGT_FEE;
    const total = this.calculatePayout(amount, rate, duration) - (tax + mgtFee);
    return total;

  }
  liquidate = (id: number, status?: LiquidationStatus) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let earningLiquidation: EarningLiquidation = await this._earningLiquidationRepository.getByIdWithInclude(id, [{ model: this._db.ApprovedEarning, required: true }]);
        if (!earningLiquidation || Object.keys(earningLiquidation).length == 0) {
          resolve({ status: false, data: "Cannot find Liquidation request" });
          return;
        }
        earningLiquidation = (earningLiquidation as any).dataValues as EarningLiquidation;
        let approvedEarning: ApprovedEarning = earningLiquidation.ApprovedEarning;
        if (approvedEarning || Object.keys(approvedEarning).length == 0) {

          resolve({ status: false, data: "Cannot find request" });
          return;
        }
        approvedEarning = (approvedEarning as any).dataValues as ApprovedEarning;

        if (status && status == LiquidationStatus.EarningPaused) {
          earningLiquidation.liquidationStatus = LiquidationStatus.EarningPaused;
          earningLiquidation.datePaused = moment().toDate();
          const duration = moment().diff(approvedEarning.createdAt, "month");

          if (duration != earningLiquidation.duration) {
            const amount = (earningLiquidation.amount / earningLiquidation.duration) * duration;
            earningLiquidation.duration = duration;
            earningLiquidation.amount = amount;
          }
          approvedEarning.earningStatus = ApprovedEarningStatus.Pause
          approvedEarning.updatedAt = moment().toDate();
          await this._earningLiquidationRepository.update(earningLiquidation);
          await this._approvedEarningRepository.update(approvedEarning);
          resolve({ status: true, data: "Liquidation has started processing, earnings have been paused successfully" });
          return;
        }


        earningLiquidation.liquidationStatus = LiquidationStatus.Processed;
        if (approvedEarning.earningStatus !== ApprovedEarningStatus.Liquidated) {
          approvedEarning.earningStatus = ApprovedEarningStatus.Pause
          approvedEarning.updatedAt = moment().toDate();
          if (approvedEarning.earningStatus === ApprovedEarningStatus.Pause) {
            approvedEarning.earningStatus = ApprovedEarningStatus.Liquidated
            approvedEarning.isClosed = true;
            let earningRequest: EarningRequest = await this._earningRequestRepository.getById(approvedEarning.earningRequestID);
            if (!earningRequest || Object.keys(earningRequest).length == 0) {
              resolve({ status: false, data: "Cannot find request" });
              return;
            }
            earningRequest = (earningRequest as any).dataValues as EarningRequest;
            earningRequest.requestStatus = EarningRequestStatus.Matured;
            earningRequest.updatedAt = moment().toDate();
            let earningRequestLog: EarningRequestLog = await this._earningRequestLogRepository.getById(approvedEarning.earningRequestLogID);
            if (!earningRequestLog || Object.keys(earningRequestLog).length == 0) {
              resolve({ status: false, data: "Cannot find request" });
              return;
            }
            earningRequestLog = (earningRequestLog as any).dataValues as EarningRequestLog;
            earningRequestLog.requestStatus = EarningRequestStatus.Matured;
            earningRequestLog.updatedAt = moment().toDate();
            await this._earningRequestRepository.update(earningRequest);
            await this._earningRequestLogRepository.update(earningRequestLog);

          }
        }
        else if (approvedEarning.earningStatus === ApprovedEarningStatus.Liquidated) {
          resolve({ status: true, data: "Already liquidated" });
          return;
        }

        await this._earningLiquidationRepository.update(earningLiquidation);
        await this._approvedEarningRepository.update(approvedEarning);

        resolve({ status: true, data: "Liquidated successfully" });
      }
      catch (err) {
        console.log("Earning Service Liquidate: ", err);
        resolve({ status: false, data: err ?? "Sorry we can not process your request at the moment. Kindly contact our support team." });
      }
    })
  }
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
      resolve({ status: false, data: err ?? "Sorry we can not process your request at the moment. Kindly contact our support team." });
    }
  })

  getEarningDetails = (id: number, type = "earningRequest") => new Promise<any>(async (resolve, reject) => {
    try {
      let request = type == "earningRequest" ? await this._earningRequestRepository.getByIdWithInclude(id, [{
        model: this._db.Customer,
        required: true
      }
      ]) : await this._earningRequestLogRepository.getByIdWithInclude(id, [{
        model: this._db.Customer,
        required: true
      }, {
        model: this._db.EarningRequest,
        required: true
      }]);
      if (request) {
        let earningRequestResponse: BaseResponse<SearchResponse<any[]>>;
        let earningRequest;
        let account = await this._accountRepository.getById(request.accountID);
        let requestDetails = [

          {
            key: "Earnings Details",
            data: [
              { key: "Type", value: request.type },
              { key: "Duration", value: request.duration + " Months" },
              { key: "Maturity Date", value: moment(request.maturityDate).format("MMMM Do YYYY") },
              { key: "Rate", value: request.rate + "%" },
              { key: "Amount", value: this._utils.currencyFormatter(request.amount) },
              { key: "Total Payout", value: this._utils.currencyFormatter(request.payout) },
              { key: "Total Interest", value: request.payout - request.amount },
              { key: "Monthly Payment", value: this._utils.currencyFormatter(request.monthlyPayment) },
            ]
          },
          {
            key: "Account Information",
            data: [
              { key: "Number", value: account?.number },
              { key: "Name", value: account?.name },
              { key: "Bank", value: account?.bank }
            ]
          }
        ];

        if (type != "earningRequest") {
          //earningRequestResponse = await this._earningRequestRepository.getById((request as EarningRequestLog).earningRequestID)//.search({ pageNumber: 1, maxSize: 1, requestId: request.requestId });
          earningRequest = await this._earningRequestRepository.getById((request as EarningRequestLog).earningRequestID);//earningRequestResponse.data?.rows[0]
        } else {
          earningRequest = request;
        }
        if (earningRequest) {
          let approvedEarning = await this._approvedEarningService.getByEarningRequestId(earningRequest.id);
          let totalRepayment = 0;
          let documents: Document[] = [];
          // let response = await this._documentService.getByEarningRequestId(request.requestId);
          // if (response.status) {
          //   documents = response?.data as Document[];

          // }
          // if (approved?.status == true && approved.data?.id) totalRepayment = await this._repaymentService.getTotalRepayment(disbursedLoan.data.id)
          resolve({ status: true, data: { id: request.id, earningRequestID: earningRequest.id, loanType: request.loanType, applyingAs: request.applyingAs, code: request.code, customerId: request.customerID, status: request.requestStatus, details: requestDetails, totalRepayment, documents, disbursedLoan: approvedEarning?.status == true ? approvedEarning.data : {} } })

        }
        else {

          resolve({ status: false, data: "Could not find loan request" });
        }
      } else {
        resolve({ status: false, data: "Could not find earning request" });
      }
    } catch (err: any) {
      reject(err);
    }
  })

  getAllEarningDetails = (customerId: number, type = "earningRequest") => new Promise<any>(async (resolve, reject) => {
    try {
      let requests = type == "earningRequest" ? await this._earningRequestRepository.getEarningByStatus(customerId, { [this.Op.not]: EarningRequestStatus.Declined }, [{
        model: this._db.Customer,
        required: true
      }
      ]) : await this._earningRequestLogRepository.getEarningByStatus(customerId, { [this.Op.not]: EarningRequestStatus.Declined }, [{
        model: this._db.Customer,
        required: true
      }, {
        model: this._db.EarningRequest,
        required: true
      }]);
      let responses = [];
      for (let i = 0; i < requests.length; i++) {
        let request = (requests[i] as any).dataValues;
        if (request) {
          let earningRequestResponse: BaseResponse<SearchResponse<any[]>>;
          let earningRequest;
          let account = await this._accountRepository.getById(request.accountID);
          let requestDetails = [

            {
              key: "Earnings Details",
              data: [
                { key: "Type", value: request.type },
                { key: "Duration", value: request.duration + " Months" },
                { key: "Maturity Date", value: request.maturityDate },
                { key: "Rate", value: request.rate + "%" },
                { key: "Amount", value: this._utils.currencyFormatter(request.amount) },
                { key: "Total Payout", value: this._utils.currencyFormatter(request.payout) },
                { key: "Total Interest", value: request.payout - request.amount },
                { key: "Monthly Payment", value: this._utils.currencyFormatter(request.monthlyPayment) },
              ]
            },
            {
              key: "Account Information",
              data: [
                { key: "Number", value: account?.number },
                { key: "Name", value: account?.name },
                { key: "Bank", value: account?.bank }
              ]
            }
          ];

          if (type != "earningRequest") {
            //earningRequestResponse = await this._earningRequestRepository.getById((request as EarningRequestLog).earningRequestID)//.search({ pageNumber: 1, maxSize: 1, requestId: request.requestId });
            earningRequest = await this._earningRequestRepository.getById((request as EarningRequestLog).earningRequestID);//earningRequestResponse.data?.rows[0]
          } else {
            earningRequest = request;
          }
          // responses.push({ id: request.id, earningRequestID: earningRequest.id, code: request.code, customerId: request.customerID, status: request.requestStatus, details: requestDetails, totalPayout:[], documents:[], approvedEarnings: {} })

          if (earningRequest) {
            let approvedEarning = await this._approvedEarningService.getByEarningRequestId(earningRequest.id);
            let totalRepayment = 0;
            let documents: Document[] = [];
            // let response = await this._documentService.getByEarningRequestId(request.requestId);
            // if (response.status) {
            //   documents = response?.data as Document[];

            // }
            // if (approved?.status == true && approved.data?.id) totalRepayment = await this._repaymentService.getTotalRepayment(disbursedLoan.data.id)
            responses.push({ id: request.id, earningRequestID: earningRequest.id, loanType: request.loanType, applyingAs: request.applyingAs, code: request.code, customerId: request.customerID, status: request.requestStatus, details: requestDetails, totalRepayment, documents, approvedEarnings: approvedEarning?.status == true ? approvedEarning.data : {} })

          }
          //  else {

          //   resolve({ status: false, data: "Could not find loan request" });
          // }
        }
      }

      resolve({ status: true, data: responses });
      // else {
      //   resolve({ status: false, data: "Could not find earning request" });
      // }
    } catch (err: any) {
      reject(err);
    }
  })
  updateEarningRequest = (earningRequest: EarningRequest) => new Promise<EarningRequest>(async (resolve, reject) => {
    try {
      let request = await this._earningRequestRepository.update(earningRequest);
      resolve(request);
    } catch (err: any) {
      reject(err);
    }
  })

  updateStatus = ({ requestStatus, startDate, id, failureReason, message }: any) => new Promise<any>(async (resolve, reject) => {
    try {
      let earningRequest = await this._earningRequestRepository.getById(id) as EarningRequest;
      let maturityDate = moment();
      let start:moment.Moment = moment();
      if (!earningRequest || Object.keys(earningRequest).length == 0) throw "Invalid Earning Request";
      earningRequest = (earningRequest as any).dataValues as EarningRequest;
      let customer: any = await this._customerRepository.getById(earningRequest.customerID);
      if (!customer || Object.keys(customer).length == 0) throw "Invalid Customer";
      customer = customer.dataValues as Customer;
      let earningRequestLog = await this._earningRequestLogService.getByEarningRequestIDAndRequestDate({ earningRequestID: earningRequest.id, requestDate: earningRequest.requestDate })
      if (!earningRequestLog || Object.keys(earningRequestLog).length == 0) throw "Invalid Earning Request log";
      earningRequestLog = (earningRequestLog as any).dataValues as EarningRequestLog;
      // let status = requestStatus as unknown as EarningRequestStatus;
      earningRequest.requestStatus = requestStatus;
      earningRequest.updatedAt = new Date();
      if (requestStatus == EarningRequestStatus.Processing) {
        earningRequest.dateProcessed = new Date();
        earningRequestLog.dateProcessed = new Date();
      }
      // else if (requestStatus == EarningRequestStatus.Approved) {
      //   earningRequest.dateApproved = new Date();
      //   earningRequestLog.dateApproved = new Date();
      // } 
      else if (requestStatus == EarningRequestStatus.Declined) {
        earningRequest.dateDeclined = new Date();
        earningRequest.failureReason = failureReason;
        earningRequestLog.dateDeclined = new Date();
        earningRequestLog.failureReason = failureReason;
      }
      else if (requestStatus == EarningRequestStatus.Active) {
        // if (!earningRequest.dateFunded) {
        //   earningRequest.dateFunded = new Date();
        //   earningRequestLog.dateFunded = new Date();
        // }
        earningRequest.dateActive = new Date();
        earningRequestLog.dateActive = new Date();
        //  start = startDate ?? new Date();
        // if (moment(start).day() >= 24) {
        //   start = moment(start).add(1,"month").startOf("month");
        // } else {
          start = moment((startDate ?? new Date()));
        // }
        maturityDate =moment((startDate ?? new Date())).add(earningRequest.duration, "month").set("date", 24);
        earningRequest.maturityDate = maturityDate.toString();//.format("MMMM Do YYYY");
        earningRequestLog.maturityDate = earningRequest.maturityDate;

      }
      await this._earningRequestRepository.update(earningRequest);

      earningRequestLog.requestStatus = requestStatus;
      earningRequestLog.updatedAt = new Date();
      await this._earningRequestLogRepository.update(earningRequestLog);
      if (requestStatus == EarningRequestStatus.Active) {
        //create disbursed loan record
        let approvedEarning: ApprovedEarning = await this._approvedEarningRepository.getByRequestAndLogID(earningRequest.id, earningRequestLog.id);

        if (approvedEarning && Object.keys(approvedEarning).length > 0) {
          approvedEarning = (approvedEarning as any).dataValues
        }
        
        if (!approvedEarning || Object.keys(approvedEarning).length == 0) {
          approvedEarning = new ApprovedEarning();
        approvedEarning.new(earningRequest, earningRequestLog,start as moment.Moment,maturityDate);
        approvedEarning.code = this._utils.autogenerate({ prefix: "APRE" });
        console.log(earningRequestLog, earningRequest, approvedEarning,moment(earningRequest.maturityDate))
        approvedEarning.maturityDate = earningRequest.maturityDate;
          await this._approvedEarningRepository.create(approvedEarning);
        } else {
          approvedEarning.nextPayment = earningRequest.monthlyPayment;
          approvedEarning.nextPaymentDate =earningRequest.type == EarningType.EndOfTenor? maturityDate.toDate(): start.set("date",24).toDate();//maturityDate.subtract(earningRequest.duration,"months").set("date",24).add(1,  "month").toDate();
          approvedEarning.earningStatus = ApprovedEarningStatus.AwaitingFirstPayment;
          approvedEarning.maturityDate = earningRequest.maturityDate;
          console.log(earningRequestLog, earningRequest, approvedEarning,moment(earningRequest.maturityDate))
          await this._approvedEarningRepository.update(approvedEarning);

        }

      }
      let notification = new WebNotification();
      notification.body = `Your earning request status for LOAN ID:${earningRequest.requestId} has been updated to ${requestStatus}`;
      if (failureReason) notification.body += `<br/><br/> Reason for Failure: ${failureReason}`;
      notification.title = `Vanaheim: Loan Status Update`
      notification.data = new WebNotData();
      notification.data.url = this._appConfig.WEBURL + "/my/earnings";
      try {
        //requestStatus == EarningRequestStatus.UpdateRequired ? this._templateService.EARNING_STATUS_UPDATE_REQUIRED(requestStatus, earningRequest.requestId, `https://vanaheim2.herokuapp.com/my/loans/${earningRequestLog.id}`, message) :
        await this._emailService.SendEmail({ subject: "Vanir Capital: Earning Status Update", html: failureReason ? this._templateService.EARNING_STATUS_UPDATE_DECLINED(customer.firstName, message ?? requestStatus, earningRequest.requestId) : this._templateService.EARNING_STATUS_UPDATE(requestStatus, earningRequest.requestId), to: customer.email, toCustomer: true });
        await this._notificationService.sendNotificationToMany({ customerIds: [earningRequest.customerID], notification })

      }
      catch (err) {
        resolve({ status: false, data: "Status updated but email failed to send" });

      }
      resolve({ status: true, data: earningRequest });
    } catch (err: any) {
      console.log(err)
      resolve({ status: false, data: "Sorry we could not update the status." })
    }
  });



  private validateRequest = (customerID: number) => {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const activeRequests = await this._earningRequestRepository.getEarningByStatus(customerID, { [this.Op.not]: EarningRequestStatus.Declined })
        if (activeRequests.length >= EnvConstants.MAX_ACTIVE_EARNING_REQUESTS) reject("You have currently reached your maximum earnings request limit");
        resolve(true);
      } catch (err) {
        console.log("Validate Request: ", err);
        reject(err);
      }
    })
  }
  private createEarningRequest = (payload: EarningPayload, customerID: number) => {

    return new Promise<EarningRequest>(async (resolve, reject) => {
      try {
        let investment = new EarningRequest();
        let declinedRequests = await this._earningRequestRepository.getEarningByStatus(customerID, EarningRequestStatus.Declined);
        if (declinedRequests.length > 0) {
          investment = Object.assign(investment, (declinedRequests[0] as any).dataValues);
        }
        const payout = this._utils.convertToPlainNumber(payload.payout);
        const amount = this._utils.convertToPlainNumber(payload.amount);
        investment.maturityDate = moment(payload.maturity).set("date", 24).format("MMMM Do YYYY");
        investment.monthlyPayment =  payout / payload.duration;
        investment.type = payload.type;
        investment.payout = payout;
        investment.duration = payload.duration;
        investment.amount = amount;
        investment.taxId = payload.taxId ?? "";
        investment.code = this._utils.autogenerate({ prefix: "ERN" });
        investment.requestStatus = EarningRequestStatus.Pending;
        investment.status = BaseStatus.Active;
        investment.requestId = investment.code;
        investment.rate = payload.rate;
        investment.topUp = 0;
        investment.topUpPayout = 0;
        if (!payload.accountInfo || !payload.accountInfo?.accountNumber) throw "Please specify an account";
        if (payload.accountInfo?.id) {
          let account = await this._accountRepository.getById(payload.accountInfo?.id);
          if (!account || Object.keys(account).length == 0) throw "Invalid Account Specified";
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
      } catch (err) {
        console.log("Create Investment Request:", err);
        reject(err);
      }
    })
  }

  private createEarningRequestLog = (request: EarningRequest) => {
    return new Promise<EarningRequest>(async (resolve, reject) => {

      let investmentRequestLog = Object.assign({}, request as EarningRequestLog);
      try {
        investmentRequestLog.id = 0;
        investmentRequestLog.earningRequestID = request.id;
        console.log("Earning REQUEST LOG", investmentRequestLog, request)
        resolve(await this._earningRequestLogRepository.create(investmentRequestLog));
      } catch (err) {
        console.log(err);
        resolve(await this._earningRequestLogRepository.create(investmentRequestLog));

      }
    });
  }

  private getMaturityDate(dateFunded: any, tenure: number, denominator: string) {
    let funded = moment(dateFunded);
    let d: any = denominator == "Months" ? "months" : "days";
    return funded.add(tenure, d);
  }
}