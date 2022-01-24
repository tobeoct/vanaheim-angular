import AppConfig from "server/config";
import { Account } from "@entities/account";
import { ApprovedEarningStatus } from "@enums/approvedEarningStatus";
import { EarningType } from "@enums/earningtype";
import { Gender } from "@enums/gender";
import { EarningRequestStatus } from "@enums/investmentrequeststatus";
import { LoanRequestStatus } from "@enums/loanrequeststatus";
import { MaritalStatus } from "@enums/maritalstatus";
import { Relationship } from "@enums/relationship";
import { BaseStatus } from "@enums/status";
import { SearchResponse } from "@models/search-response";
import { WebNotification, WebNotificationData } from "@models/webnotification";
import { NOKRepository } from "@repository/implementation/nok-repository";
import { IDocumentRepository } from "@repository/interface/document/Idocument-repository";
import { IAccountRepository } from "@repository/interface/Iaccount-repository";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { IMeansOfIdentificationRepository } from "@repository/interface/Imeans-of-identification-repository";
import { IApprovedEarningRepository } from "@repository/interface/investment/Iapproved-earning-repository";
import { IEarningLiquidationRepository } from "@repository/interface/investment/Iearning-liquidation-repository";
import { IEarningPayoutRepository } from "@repository/interface/investment/Iearning-payout-repository";
import { IEarningTopUpRepository } from "@repository/interface/investment/Iearning-topup-repository";
import { IEarningsEmploymentRepository } from "@repository/interface/investment/Iearnings-employment-repository";
import { IEarningRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";
import { IEarningRequestRepository } from "@repository/interface/investment/Iinvestment-request-repository";
import { IAccountService } from "@services/interfaces/Iaccount-service";
import { IDocumentService } from "@services/interfaces/Idocument-service";
import { INotificationService } from "@services/interfaces/Inotification-service";
import { IApprovedEarningService } from "@services/interfaces/investment/Iapproved-earning-service";
import { IEarningRequestLogService } from "@services/interfaces/investment/Iinvestment-log-request-service";
import { IEarningService } from "@services/interfaces/investment/Iinvestmentservice";
import moment = require("moment");
import { EarningApplication } from "src/app/modules/earnings/earnings-application";
import { BaseResponse } from "../base-service";
import EmailService, { EmailType } from "../common/email-service";
import { EnvConstants } from "../common/env.constants";
import { TemplateService } from "../common/template-service";
import UtilService from "../common/util";
import { EarningRequest } from "@entities/investment/investment-request";
import { EarningRequestLog } from "@entities/investment/investment-request-log";
import { Customer } from "@entities/customer";
import { EarningLiquidation } from "@entities/investment/earnings-liquidation";
import { Document } from "@entities/document";
import { TopUpStatus } from "@enums/topUpStatus";
import { ApprovedEarning } from "@entities/investment/approved-investment";
import { EarningsEmployment } from "@entities/investment/earnings-employment";
import { EarningTopUp } from "@entities/investment/earnings-topup";
import { MeansOfIdentification } from "@entities/investment/means-of-identification";
import { NOK } from "@entities/nok";
import { LiquidationStatus } from "@enums/liquidationStatus";
export class EarningService implements IEarningService {
  constructor(private _db: any, private _appConfig: AppConfig, private _documentService: IDocumentService, private _nokRepository: NOKRepository, private _documentRepository: IDocumentRepository, private _earningsEmploymentRepository: IEarningsEmploymentRepository, private _meansOfIdentificationRepository: IMeansOfIdentificationRepository, private _earningPayOutRepository: IEarningPayoutRepository, private _earningTopUpRepository: IEarningTopUpRepository, private _earningLiquidationRepository: IEarningLiquidationRepository, private _approvedEarningService: IApprovedEarningService, private _approvedEarningRepository: IApprovedEarningRepository, private Op: any, private _notificationService: INotificationService, private _customerRepository: ICustomerRepository, private _earningRequestLogService: IEarningRequestLogService, private _earningRequestRepository: IEarningRequestRepository, private _earningRequestLogRepository: IEarningRequestLogRepository, private _accountRepository: IAccountRepository, private _accountService: IAccountService, private _templateService: TemplateService, private _emailService: EmailService, private _utils: UtilService) {

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
          const newPrincipal = (+earningRequest.amount) + (+amount);
          const newPayout = (+earningRequest.payout) + (+payout);
          const payoutsSoFar = await this._earningPayOutRepository.getPayoutSoFar(approvedEarning.id);
          const newRemaining = newPayout - (payoutsSoFar[0]?.total ?? 0);
          const newMonthlyPayment = newRemaining / duration;
          earningRequest.amount = newPrincipal;
          earningRequest.payout = newPayout;
          earningRequest.monthlyPayment = newMonthlyPayment;
          earningRequest.requestStatus = EarningRequestStatus.Active;

          earningRequestLog.requestStatus = EarningRequestStatus.Active;
          earningRequestLog.topUpPayout = ((+earningRequestLog.topUpPayout) ?? 0) + (+payout);
          earningRequestLog.topUp = ((+earningRequestLog.topUp) ?? 0) + (+amount);

          earningRequestLog.amount = newPrincipal;
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
        resolve({ status: false, data: "Sorry we can not process your request at the moment. Kindly contact our support team." });
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
        let customer: Customer = new Customer();
        let earningLiquidation: EarningLiquidation = await this._earningLiquidationRepository.getByIdWithInclude(id, [{ model: this._db.ApprovedEarning, required: true }]);
        if (!earningLiquidation || Object.keys(earningLiquidation).length == 0) {
          resolve({ status: false, data: "Cannot find Liquidation request" });
          return;
        }
        earningLiquidation = (earningLiquidation as any).dataValues as EarningLiquidation;
        let approvedEarning: ApprovedEarning = earningLiquidation.ApprovedEarning;
        if (!approvedEarning || Object.keys(approvedEarning).length == 0) {

          resolve({ status: false, data: "Cannot find request" });
          return;
        }
        approvedEarning = (approvedEarning as any).dataValues as ApprovedEarning;

        if (status && status == LiquidationStatus.Declined) {
          let earningRequest: EarningRequest = await this._earningRequestRepository.getById(approvedEarning.earningRequestID);
          if (!earningRequest || Object.keys(earningRequest).length == 0) {
            resolve({ status: false, data: "Cannot find request" });
            return;
          }
          earningRequest = (earningRequest as any).dataValues as EarningRequest;
          earningRequest.requestStatus = EarningRequestStatus.Active;
          earningRequest.updatedAt = moment().toDate();

          customer = await this._customerRepository.getById(earningRequest.customerID);
          if (!customer || Object.keys(customer).length == 0) throw "Invalid Customer";

          let earningRequestLog: EarningRequestLog = await this._earningRequestLogRepository.getById(approvedEarning.earningRequestLogID);
          if (!earningRequestLog || Object.keys(earningRequestLog).length == 0) {
            resolve({ status: false, data: "Cannot find request" });
            return;
          }
          earningRequestLog = (earningRequestLog as any).dataValues as EarningRequestLog;
          earningRequestLog.requestStatus = EarningRequestStatus.Active;
          earningRequestLog.updatedAt = moment().toDate();
          earningLiquidation.liquidationStatus = LiquidationStatus.Declined;
          approvedEarning.earningStatus = ApprovedEarningStatus.OnTrack;
          await this._earningLiquidationRepository.update(earningLiquidation);
          await this._earningRequestRepository.update(earningRequest);
          await this._earningRequestLogRepository.update(earningRequestLog);
          await this._approvedEarningRepository.update(approvedEarning);
          resolve({ status: true, data: "Request Declined" });
          return;
        }
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

        await this._emailService.SendEmail({ type: EmailType.Earning, to: customer?.email, html: this._templateService.EARNING_LIQUIDATION_APPROVAL(customer?.firstName), toCustomer: true })
        resolve({ status: true, data: "Liquidated successfully" });
      }
      catch (err) {
        console.log("Earning Service Liquidate: ", err);
        resolve({ status: false, data: err ?? "Sorry we can not process your request at the moment. Kindly contact our support team." });
      }
    })
  }
  process = (customer: Customer, payload: any) => new Promise<any>(async (resolve, reject) => {
    try {
      const email = customer.email;
      const name = customer.firstName;

      for (let key in payload) {
        payload[key] = JSON.parse(payload[key]);
      }
      const application = payload as EarningApplication;
      const { payout, duration, rate, maturity, amount, type } = application.earningsCalculator;
      await this.validateRequest(customer.id);
      const request = await this.createEarningRequest(application, customer);
      const requestLog = await this.createEarningRequestLog(request);
      const customerTemplate = this._templateService.INVESTMENT_CUSTOMER_TEMPLATE((!name) ? "Customer" : `${this._utils.titleCase(name)}`);
      const adminTemplate = this._templateService.INVESTMENT_ADMIN_TEMPLATE(name, email, this._utils.currencyFormatter(this._utils.convertToPlainNumber(amount)), duration.toString() + " Months", maturity, this._utils.currencyFormatter(payout), rate, type);
      await this._emailService.SendEmail({ type: EmailType.Earning, to: email, filePaths: [`dist/vanaheim/assets/static/VANIR CAPITAL GLOBAL PITCH DECK_Vol 4.pdf`], html: customerTemplate, toCustomer: true })

      await this._emailService.SendEmail({ type: EmailType.Earning, to: this._appConfig.INVESTMENT_EMAIL, html: adminTemplate, toCustomer: false });

      resolve({ status: true, data: { message: "Thanks for indicating your interest in earnings 😊" } });

    }
    catch (err: any) {
      console.log("Earning Service: ", err);
      resolve({ status: false, data: err?.message ?? "Sorry we can not process your request at the moment. Kindly contact our support team." });
    }
  })

  getEarningDetails = (id: number, type = "earningRequest") => new Promise<any>(async (resolve, reject) => {
    try {
      let request = type == "earningRequest" ? await this._earningRequestRepository.getByIdWithInclude(id, [{
        model: this._db.Customer,
        required: true
      }, {
        model: this._db.EarningsEmployment,
        required: true
      }, {
        model: this._db.MeansOfIdentification,
        required: true,
        include: [{
          model: this._db.Document,
          required: true
        }]
      }
      ]) : await this._earningRequestLogRepository.getByIdWithInclude(id, [{
        model: this._db.Customer,
        required: true
      }, {
        model: this._db.EarningsEmployment,
        required: true
      }, {
        model: this._db.MeansOfIdentification,
        required: true,
        include: [{
          model: this._db.Document,
          required: true
        }]
      }, {
        model: this._db.EarningRequest,
        required: true
      }]);
      if (request) {
        let earningRequestResponse: BaseResponse<SearchResponse<any[]>>;
        let earningRequest;
        let account = await this._accountRepository.getById(request.accountID);
        request.Customer.NOK = await this._nokRepository.getByCustomerID(request.customerID);
        let requestDetails = [

          {
            key: "Earnings Details",
            data: [
              { key: "Type", value: request.type },
              { key: "Duration", value: request.duration + " Months" },
              { key: "Maturity Date", value: request.requestStatus == LoanRequestStatus.Pending ? request.maturityDate : moment(request.maturityDate).format("MMMM Do YYYY") },
              { key: "Rate", value: request.rate + "% per annum" },
              { key: "Amount", value: this._utils.currencyFormatter(request.amount) },
              { key: "Total Payout", value: this._utils.currencyFormatter(request.payout) },
              { key: "Total Interest", value: this._utils.currencyFormatter(request.payout - request.amount) },
              { key: "Monthly Payment", value: this._utils.currencyFormatter(request.monthlyPayment) },
            ]
          },
          {
            key: "Personal Information",
            data: [
              { key: "Name", value: this._utils.replaceAll((request.Customer.title + " " + request.Customer.lastName + " " + request.Customer.otherNames + " " + request.Customer.firstName), "null", "") },
              { key: "Date Of Birth", value: moment(request.Customer.dateOfBirth).format("MMMM Do YYYY") },
              { key: "Gender", value: request.Customer.gender?.toString() },
              { key: "Marital Status", value: request.Customer.maritalStatus?.toString() },
              { key: "Tax Identification Number", value: request.Customer.taxId?.toString() },
              { key: "Email Address", value: request.Customer.email },
              { key: "Phone Number", value: request.Customer.phoneNumber },
              { key: "Address", value: request.Customer.address },
            ]
          },
          {
            key: "Account Information",
            data: [
              { key: "Number", value: account?.number },
              { key: "Name", value: account?.name },
              { key: "Bank", value: account?.bank }
            ]
          },
          {
            key: "Employment Information",
            data: [
              { key: "Current Employer", value: request.EarningsEmployment?.currentEmployer },
              { key: "Previous Employer", value: request.EarningsEmployment?.previousEmployer },
              { key: "Business Sector", value: request.EarningsEmployment?.businessSector },
              { key: "Email", value: request.EarningsEmployment?.email },
              { key: "Phone Number", value: request.EarningsEmployment?.phoneNumber },
              { key: "Address", value: request.EarningsEmployment?.address },
            ]
          },
          {
            key: "NOK Information",
            data: [
              { key: "Name", value: this._utils.replaceAll(this._utils.replaceAll((request.Customer?.NOK?.lastName + " " + request.Customer?.NOK?.otherNames + " " + request.Customer?.NOK?.firstName), "null", ""), "undefined", "") },
              { key: "Date Of Birth", value: request.Customer?.NOK?.dateOfBirth },
              { key: "Relationship", value: request.Customer?.NOK?.relationship.toString() },
              { key: "Email Address", value: request.Customer?.NOK?.email },
              { key: "Phone Number", value: request.Customer?.NOK?.phoneNumber },
            ]
          },
          {
            key: "Means Of Identification",
            data: [
              { key: "Type", value: request.MeansOfIdentification?.type },
              { key: "ID Number", value: request.MeansOfIdentification?.idNumber },
              { key: "Issue Date", value: request.MeansOfIdentification?.issueDate },
              { key: "Expiry Date", value: request.MeansOfIdentification?.expiryDate },
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
          let response = await this._documentService.getByRequestId(request.requestId);
          if (response.status) {
            documents = response?.data as Document[];

          }
          // if (approvedEarning?.status == true && approvedEarning.data?.id) totalRepayment = await this._repaymentService.getTotalRepayment(approvedEarning.data.id)
          resolve({ status: true, data: { id: request.id, earningRequestID: earningRequest.id, loanType: request.loanType, applyingAs: request.applyingAs, code: request.requestId, customerId: request.customerID, status: request.requestStatus, details: requestDetails, totalRepayment, documents, approvedEarnings: approvedEarning?.status == true ? approvedEarning.data : {} } })

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
                { key: "Maturity Date", value: request.requestStatus == LoanRequestStatus.Pending ? request.maturityDate : moment(request.maturityDate).format("MMMM Do YYYY") },
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
            // if (approved?.status == true && approved.data?.id) totalRepayment = await this._repaymentService.getTotalRepayment(approvedEarnings.data.id)
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

  updateStatus = ({ requestStatus, startDate, id, failureReason, message, serialNumber }: any) => new Promise<any>(async (resolve, reject) => {
    try {
      let earningRequest = await this._earningRequestRepository.getById(id) as EarningRequest;
      let maturityDate = moment();
      let start: moment.Moment = moment();
      if (!earningRequest || Object.keys(earningRequest).length == 0) throw "Invalid Earning Request";
      earningRequest = (earningRequest as any).dataValues as EarningRequest;
      let customer: Customer = await this._customerRepository.getById(earningRequest.customerID);
      if (!customer || Object.keys(customer).length == 0) throw "Invalid Customer";
      customer = ((customer as any).dataValues) as Customer;
      let earningRequestLog = await this._earningRequestLogService.getByEarningRequestIDAndRequestDate({ earningRequestID: earningRequest.id, requestDate: earningRequest.requestDate })
      if (!earningRequestLog || Object.keys(earningRequestLog).length == 0) throw "Invalid Earning Request log";
      earningRequestLog = (earningRequestLog as any).dataValues as EarningRequestLog;
      // let status = requestStatus as unknown as EarningRequestStatus;
      earningRequest.requestStatus = requestStatus;
      earningRequest.updatedAt = new Date();
      if (requestStatus == EarningRequestStatus.Processing) {
        earningRequest.dateProcessed = new Date();
        earningRequestLog.dateProcessed = new Date();
        // earningRequest.code = earningRequest.autogenerateID(serialNumber);
        if (serialNumber) {
          const requestByUniqueID = await this._earningRequestRepository.getByRequestID(new EarningRequest().autogenerateID(serialNumber));

          if (requestByUniqueID && Object.keys(requestByUniqueID).length > 0) {
            throw "Earning ID has already been assigned to another earning";
          }
          earningRequest.requestId = new EarningRequest().autogenerateID(serialNumber);
          earningRequestLog.requestId = new EarningRequest().autogenerateID(serialNumber);
        }
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
        maturityDate = moment((startDate ?? new Date())).add(earningRequest.duration, "month").set("date", 24);
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
          approvedEarning.new(earningRequest, earningRequestLog, start as moment.Moment, maturityDate);
          approvedEarning.code = this._utils.autogenerate({ prefix: "APRE" });
          console.log(earningRequestLog, earningRequest, approvedEarning, moment(earningRequest.maturityDate))
          approvedEarning.maturityDate = earningRequest.maturityDate;
          await this._approvedEarningRepository.create(approvedEarning);
        } else {
          approvedEarning.nextPayment = earningRequest.type == EarningType.EndOfTenor ? earningRequest.payout : earningRequest.monthlyPayment;
          approvedEarning.nextPaymentDate = earningRequest.type == EarningType.EndOfTenor ? maturityDate.toDate() : start.set("date", 24).toDate();//maturityDate.subtract(earningRequest.duration,"months").set("date",24).add(1,  "month").toDate();
          approvedEarning.earningStatus = ApprovedEarningStatus.AwaitingFirstPayment;
          approvedEarning.maturityDate = earningRequest.maturityDate;
          console.log(earningRequestLog, earningRequest, approvedEarning, moment(earningRequest.maturityDate))
          await this._approvedEarningRepository.update(approvedEarning);

        }

      }
      let notification = new WebNotification();
      notification.body = `Your earning request status for LOAN ID:${earningRequest.requestId} has been updated to ${requestStatus}`;
      if (failureReason) notification.body += `<br/><br/> Reason for Failure: ${failureReason}`;
      notification.title = `Vanaheim: Loan Status Update`
      notification.data = new WebNotificationData();
      notification.data.url = this._appConfig.WEBURL + "/my/earnings";
      try {
        //requestStatus == EarningRequestStatus.UpdateRequired ? this._templateService.EARNING_STATUS_UPDATE_REQUIRED(requestStatus, earningRequest.requestId, `https://vanaheim2.herokuapp.com/my/loans/${earningRequestLog.id}`, message) :
        await this._emailService.SendEmail({ subject: "Vanir Capital: Earning Status Update", html: failureReason ? this._templateService.EARNING_STATUS_UPDATE_DECLINED(customer.firstName, message ?? requestStatus, earningRequest.requestId) : this._templateService.EARNING_STATUS_UPDATE(earningRequest.requestStatus, earningRequest.requestStatus == EarningRequestStatus.Pending ? "Not yet assigned" : earningRequest.requestId, `${customer.title} ${customer.firstName} ${customer.lastName}`, earningRequest.payout, earningRequest.payout - earningRequest.amount), to: customer.email, toCustomer: true });
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
  private createEarningRequest = (application: EarningApplication, customer: Customer) => {
    const customerID = customer.id;
    return new Promise<EarningRequest>(async (resolve, reject) => {
      try {
        let investment = new EarningRequest();
        let declinedRequests = await this._earningRequestRepository.getEarningByStatus(customerID, EarningRequestStatus.Declined);
        if (declinedRequests.length > 0) {
          investment = Object.assign(investment, (declinedRequests[0] as any).dataValues);
        }
        const payload = application.earningsCalculator;
        const payout = this._utils.convertToPlainNumber(payload.payout);
        const amount = this._utils.convertToPlainNumber(payload.amount);
        investment.maturityDate = moment().add(payload.duration).set("date", 24).format("MMMM Do YYYY");
        investment.monthlyPayment = payload.type == EarningType.EndOfTenor ? payout : payout / payload.duration;
        investment.type = payload.type;
        investment.payout = payout;
        investment.duration = payload.duration;
        investment.amount = amount;
        investment.taxId = application.personalInfo.taxId ?? "";
        investment.code = this._utils.autogenerate({ prefix: "ERN" });
        investment.requestStatus = EarningRequestStatus.Pending;
        investment.status = BaseStatus.Active;
        investment.requestId = investment.code;
        investment.rate = payload.rate;
        investment.topUp = 0;
        investment.topUpPayout = 0;
        const accountInfos = application.accountInfo;
        if (!accountInfos) throw "Please specify an account";
        const accountInfo = accountInfos[0];
        if (!accountInfo.accountNumber) throw "Invalid account number";
        if (accountInfo?.id) {
          let account = await this._accountRepository.getById(accountInfo?.id);
          if (!account || Object.keys(account).length == 0) throw "Invalid Account Specified";
          account = (account as any).dataValues as Account;
          investment.Account = account;
          investment.accountID = accountInfo.id;
        } else {
          const account = await this._accountService.createAccount(customerID, accountInfo);
          investment.accountID = account.id;
        }

        const employmentInfo = application.employmentInfo;
        if (!employmentInfo || Object.keys(employmentInfo).length == 0) throw "Please specify your employment details";
        if (employmentInfo?.id) {
          let earningsEmployment = await this._earningsEmploymentRepository.getById(employmentInfo?.id);
          if (!earningsEmployment || Object.keys(earningsEmployment).length == 0) throw "Invalid Employment Details Specified";
          earningsEmployment = (earningsEmployment as any).dataValues as Account;
          investment.Account = earningsEmployment;
          investment.employmentID = employmentInfo.id;
        } else {
          let earningsEmployment = new EarningsEmployment();
          earningsEmployment.address = (application.employmentInfo.address?.street + " " + application.employmentInfo.address?.city + " " + application.employmentInfo.address?.state);
          earningsEmployment.street = application.employmentInfo?.address?.street;
          earningsEmployment.city = application.employmentInfo?.address?.city;
          earningsEmployment.state = application.employmentInfo?.address?.state;
          earningsEmployment.email = application.employmentInfo?.email;
          earningsEmployment.currentEmployer = application.employmentInfo?.currentEmployer;
          earningsEmployment.previousEmployer = application.employmentInfo?.previousEmployer;
          earningsEmployment.businessSector = application.employmentInfo?.businessSector;
          earningsEmployment.phoneNumber = application.employmentInfo?.phoneNumber;
          earningsEmployment.customerID = customerID
          earningsEmployment.code = this._utils.autogenerate({ prefix: "EREMP" });
          earningsEmployment.status = BaseStatus.Active;
          const employment = await this._earningsEmploymentRepository.create(earningsEmployment);
          investment.employmentID = employment.id;
        }


        const meansOfIdentificationInfo = application.meansOfIdentification;
        if (!meansOfIdentificationInfo || Object.keys(meansOfIdentificationInfo).length == 0) throw "Please specify a means of identification";
        // if (meansOfIdentificationInfo?.id) {
        //   let earningsEmployment = await this._earningsEmploymentRepository.getById(meansOfIdentificationInfo?.id);
        //   if (!earningsEmployment || Object.keys(earningsEmployment).length == 0) throw "Invalid Account Specified";
        //   earningsEmployment = (earningsEmployment as any).dataValues as Account;
        //   investment.Account = earningsEmployment;
        //   investment.employmentID = meansOfIdentificationInfo.id;
        // } else {
        let meansOfIdentification = Object.assign(new MeansOfIdentification(), application.meansOfIdentification);
        meansOfIdentification.code = this._utils.autogenerate({ prefix: "MID" });
        meansOfIdentification.status = BaseStatus.Active;
        if (!application.meansOfIdentification.issueDate) meansOfIdentification.issueDate = undefined;
        if (!application.meansOfIdentification.expiryDate) meansOfIdentification.expiryDate = undefined;
        meansOfIdentification.documentID = application.meansOfIdentification.document?.id;
        const meansOfIdentificationInDb = await this._meansOfIdentificationRepository.create(meansOfIdentification);
        investment.meansOfIdentificationID = meansOfIdentificationInDb.id;
        // }



        //For NOK
        let nok: NOK;
        let n: any = await this._nokRepository.getByCustomerID(customerID);
        console.log(n)
        if (!n || Object.keys(n).length == 0) {
          nok = new NOK();
          nok.id = 0;
        } else {
          //  nok = n.dataValues as NOK;
          nok = Object.assign(n.dataValues as NOK, new NOK());
        }
        if (!application.nokInfo) throw "Please provide next of kin details";
        var nokInfo = application.nokInfo;
        if (!nok || nok.id == 0) {
          if (!nokInfo || Object.keys(nokInfo).length == 0) throw "Please provide your Next Of Kin details";

          nok.createdAt = new Date();
          nok.code = this._utils.autogenerate({ prefix: "NOK" });
          nok.status = BaseStatus.Active;
        }
        else {
          nok.updatedAt = new Date();
        }

        if (nokInfo && Object.keys(nokInfo).length > 0) {
          nok.customerID = customerID;
          nok.dateOfBirth = this._utils.toDate(nokInfo.dob.day, nokInfo.dob.month, nokInfo.dob.year);
          nok.email = nokInfo.email;
          nok.otherNames = nokInfo.otherNames;
          nok.lastName = nokInfo.surname;
          nok.firstName = nokInfo.otherNames;
          nok.relationship = nokInfo.relationship as unknown as Relationship;
          nok.phoneNumber = nokInfo.phoneNumber;
          nok.title = nokInfo.title;
          nok.address = "";
        }
        // save or update nok
        if (nok.id == 0) {
          let nokInDb = await this._nokRepository.create(nok);
          nok.id = nokInDb.id;
        } else {
          let nokInDb = await this._nokRepository.update(nok);
        }
        nok.customer = customer;

        //FOR PERSONAL INFO
        if (application.personalInfo) {
          console.log("PERSONAL INFO")
          let personalInfo = application.personalInfo;
          customer.updatedAt = new Date();
          if (personalInfo && Object.keys(personalInfo).length > 0) {

            customer.dateOfBirth = this._utils.toDate(personalInfo.dob.day, personalInfo.dob.month, personalInfo.dob.year);
            customer.email = personalInfo.email;
            customer.firstName = personalInfo.firstName;
            customer.lastName = personalInfo.surname;
            customer.otherNames = personalInfo.otherNames;
            customer.address = this._utils.toAddress(personalInfo.address.street.trim(), personalInfo.address.city.trim(), personalInfo.address.state.trim());
            customer.gender = personalInfo.gender as unknown as Gender;
            customer.phoneNumber = personalInfo.phoneNumber;
            customer.title = personalInfo.title;
            customer.maritalStatus = personalInfo.maritalStatus as unknown as MaritalStatus;
            customer.taxId = personalInfo.taxId;
          }
        }
        console.log("This is the customer", customer)
        customer.NOKID = nok.id;
        const customerInDb = await this._customerRepository.update(customer);
        console.log(customerInDb)


        investment.customerID = customerID;
        investment.requestDate = new Date();
        if (investment.id) {
          await this._earningRequestRepository.update(investment);
          resolve(investment);
        } else {
          const request = await this._earningRequestRepository.create(investment);
          let docInDb: any = await this._documentRepository.getById(application.meansOfIdentification.document?.id);

          if (docInDb && Object.keys(docInDb).length > 0) {
            let doc = docInDb.dataValues as Document;
            doc.requestId = request.requestId;
            await this._documentRepository.update(doc)

          }
          resolve(request);
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