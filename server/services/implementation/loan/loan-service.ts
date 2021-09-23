import AppConfig from "@api/config";
import { Account } from "@models/account";
import { Customer } from "@models/customer";
import { Document } from "@models/document";
import { LoanRequestStatus } from "@models/helpers/enums/loanrequeststatus";
import { LoanStatus } from "@models/helpers/enums/loanstatus";
import { BaseStatus } from "@models/helpers/enums/status";
import { DisbursedLoan } from "@models/loan/disbursed-loan";
import { LoanRequest } from "@models/loan/loan-request";
import { LoanRequestLog } from "@models/loan/loan-request-log";
import { WebNotData, WebNotification } from "@models/webnotification";
import { AccountRepository } from "@repository/implementation/account-repository";
import { NOKRepository } from "@repository/implementation/nok-repository";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { ILoanTypeRequirementRepository } from "@repository/interface/Iloantyperequirement-repository";
import { IDisbursedLoanRepository } from "@repository/interface/loan/Idisbursed-loan-repository";
import { ILoanRequestLogRepository } from "@repository/interface/loan/Iloan-request-log-repository";
import { IDocumentService } from "@services/interfaces/Idocument-service";
import { INotificationService } from "@services/interfaces/Inotification-service";
import { IRepaymentService } from "@services/interfaces/Irepayment-service";
import { IDisbursedLoanService } from "@services/interfaces/loan/Idisbursed-loan-service";
import { ILoanRequestLogService } from "@services/interfaces/loan/Iloan-log-request-service";
import { ILoanRequestService } from "@services/interfaces/loan/Iloan-request-service";
import { ILoanTypeRequirementService } from "@services/interfaces/loan/Iloan-type-requirement-service";
import { ILoanService } from "@services/interfaces/loan/Iloanservice";
import moment = require("moment");
import { BVN } from "src/app/modules/loan/personal/bvn/bvn";
import { BaseResponse } from "../base-service";
import EmailService from "../common/email-service";
import { TemplateService } from "../common/template-service";
import UtilService from "../common/util";
import { SearchResponse } from "./loan-request-service";

export class LoanService implements ILoanService {
  constructor(private _db: any, private _appConfig: AppConfig, private _repaymentService: IRepaymentService, private _disbursedLoanService: IDisbursedLoanService, private _disbursedLoanRepository: IDisbursedLoanRepository, private _nokRepository: NOKRepository, private _accountRepository: AccountRepository, private _notificationService: INotificationService, private _loanTypeRequirementService: ILoanTypeRequirementService, private _documentService: IDocumentService, private _templateService: TemplateService, private _emailService: EmailService, private _customerRepository: ICustomerRepository, private _loanRequestService: ILoanRequestService, private _utilService: UtilService, private _loanRequestLogService: ILoanRequestLogService, private _loanRequestLogRepository: ILoanRequestLogRepository) {

  }
  getLoanDetails = (id: number, type = "loanRequest") => new Promise<any>(async (resolve, reject) => {
    try {
      let request = type == "loanRequest" ? await this._loanRequestService.getByIdWithInclude(id, [{
        model: this._db.Customer,
        required: true
      }
      ]) : await this._loanRequestLogService.getByIdWithInclude(id, [{
        model: this._db.Customer,
        required: true
      }]);
      if (request) {
        let loanRequestResponse: BaseResponse<SearchResponse<any[]>>;
        let loanRequest;
        request.loanTypeRequirements = await this._loanTypeRequirementService.getByIdExtended(request.loanTypeRequirementID);
        request.Customer.NOK = await this._nokRepository.getByCustomerID(request.customerID);
        let accountDetails = await this._accountRepository.search({ number: request.accountNumber }, 0, 1);
        let account = accountDetails?.rows[0] as Account;
        let requestDetails = [

          {
            key: "Loan Details",
            data: [
              { key: "Loan Type", value: request.loanType },
              { key: "Applying As", value: request.applyingAs },
              // { key: "Loan Product", value: request.loanProduct },
              { key: "Loan Purpose", value: request.loanPurpose },
              { key: "Loan Amount", value: this._utilService.currencyFormatter(request.amount) },
              { key: "Monthly Repayment", value: this._utilService.currencyFormatter(request.monthlyPayment) },
              { key: "Total Repayment", value: this._utilService.currencyFormatter(request.totalRepayment) },
              { key: "Tenure", value: request.tenure + " " + request.denominator },
            ]
          },
          {
            key: "Personal Information",
            data: [
              { key: "Name", value: this._utilService.replaceAll((request.Customer.title + " " + request.Customer.lastName + " " + request.Customer.otherNames + " " + request.Customer.firstName), "null", "") },
              { key: "Date Of Birth", value: request.Customer.dateOfBirth },
              { key: "Gender", value: request.Customer.gender?.toString() },
              { key: "Marital Status", value: request.Customer.maritalStatus?.toString() },
              { key: "Email Address", value: request.Customer.email },
              { key: "Phone Number", value: request.Customer.phoneNumber },
              { key: "Address", value: request.Customer.address },
            ]
          },
          {
            key: "Account Information",
            data: [
              { key: "Number", value: request.accountNumber },
              { key: "Name", value: account?.name },
              { key: "Bank", value: account?.bank }
            ]
          }
        ];
        if (["PayMe Loan", "FloatMe Loan (Individual)"].includes(request.loanType)) {

          let personal = [
            {
              key: "Employment Information",
              data: [
                { key: "Employer", value: request.loanTypeRequirements?.employment?.employer },
                { key: "Business Sector", value: request.loanTypeRequirements?.employment?.businessSector },
                { key: "Email", value: request.loanTypeRequirements?.employment?.email },
                { key: "Phone Number", value: request.loanTypeRequirements?.employment?.phoneNumber },
                { key: "Address", value: request.loanTypeRequirements?.employment?.address },
                { key: "Net Monthly Salary", value: request.loanTypeRequirements?.employment?.netMonthlySalary },
                { key: "Pay Day", value: request.loanTypeRequirements?.employment?.payDay },
              ]
            },
            {
              key: "NOK Information",
              data: [
                { key: "Name", value: this._utilService.replaceAll(this._utilService.replaceAll((request.Customer?.NOK?.lastName + " " + request.Customer?.NOK?.otherNames + " " + request.Customer?.NOK?.firstName), "null", ""), "undefined", "") },
                { key: "Date Of Birth", value: request.Customer?.NOK?.dateOfBirth },
                { key: "Relationship", value: request.Customer?.NOK?.relationship.toString() },
                { key: "Email Address", value: request.Customer?.NOK?.email },
                { key: "Phone Number", value: request.Customer?.NOK?.phoneNumber },
              ]
            }]
          requestDetails = [...requestDetails, ...personal];
        }
        else {
          let business = [
            {
              key: "Company Information",
              data: [
                { key: "Name", value: request.loanTypeRequirements?.company?.name },
                { key: "RC No", value: request.loanTypeRequirements?.company?.rcNo },
                { key: "Nature Of Business", value: request.loanTypeRequirements?.company?.natureOfBusiness },
                { key: "Date Of Incorporation", value: request.loanTypeRequirements?.company?.dateOfIncorporation },
                { key: "Time In Business", value: request.loanTypeRequirements?.company?.timeInBusiness },
                { key: "Email", value: request.loanTypeRequirements?.company?.email },
                { key: "Phone Number", value: request.loanTypeRequirements?.company?.phoneNumber },
                { key: "Address", value: request.loanTypeRequirements?.company?.address },
              ]
            },
            {
              key: "Collateral Information",
              data: [
                { key: "Owner", value: request.loanTypeRequirements?.collateral?.owner },
                { key: "Valuation", value: this._utilService.currencyFormatter(request.loanTypeRequirements?.collateral?.valuation) },
                { key: "Type", value: request.loanTypeRequirements?.collateral?.type },
                { key: "Description", value: request.loanTypeRequirements?.collateral?.description },
                { key: "Document", value: request.loanTypeRequirements?.collateral?.document?.requirement },
              ]
            }]

          request.loanTypeRequirements?.shareholders?.forEach((s, i) => {
            business.push({
              key: "Shareholder " + (i + 1),
              data: [
                { key: "Name", value: s.title + " " + s.surname + " " + s.otherNames },
                { key: "Designation", value: s.designation },
                { key: "Educational Qualification", value: s.educationalQualification },
                { key: "Date Of Birth", value: s.dateOfBirth },
                { key: "Gender", value: s.gender?.toString() },
                { key: "Marital Status", value: s.maritalStatus?.toString() },
                { key: "Email Address", value: s.email },
                { key: "Phone Number", value: s.phoneNumber },
                { key: "Address", value: s.address }
              ]
            })
          }

          )
          requestDetails = [...requestDetails, ...business];
        }
        if (type != "loanRequest") {
          //loanRequestResponse = await this._loanRequestService.getById((request as LoanRequestLog).loanRequestID)//.search({ pageNumber: 1, maxSize: 1, requestId: request.requestId });
          loanRequest = await this._loanRequestService.getById((request as LoanRequestLog).loanRequestID);//loanRequestResponse.data?.rows[0]
        } else {
          loanRequest = request;
        }
        if (loanRequest) {
          let disbursedLoan = await this._disbursedLoanService.getDisbursedLoanById(loanRequest.id);
          let totalRepayment = 0;
          let documents: Document[] = [];
          let response = await this._documentService.getByLoanRequestId(request.requestId);
          if (response.status) {
            documents = response?.data as Document[];

          }
          if (disbursedLoan?.status == true && disbursedLoan.data?.id) totalRepayment = await this._repaymentService.getTotalRepayment(disbursedLoan.data.id)
          resolve({ status: true, data: { id: request.id, loanRequestID: loanRequest.id, loanType: request.loanType, applyingAs: request.applyingAs, code: request.code, customerId: request.customerID, status: request.requestStatus, details: requestDetails, totalRepayment, documents, disbursedLoan: disbursedLoan?.status == true ? disbursedLoan.data : {} } });

        } else {

          resolve({ status: false, data: "Could not find loan request" });
        }
      } else {
        resolve({ status: false, data: "Could not find loan request" });
      }
    } catch (err: any) {
      reject(err);
    }
  })
  getAllLoanRequests: () => Promise<LoanRequest[]>;
  getAllLoanRequestLogs: () => Promise<LoanRequestLog[]>;
  getLoanRequestById: () => Promise<LoanRequest>;
  getLoanRequestLogById: () => Promise<LoanRequestLog>;
  updateLoanRequest = (loanRequest: LoanRequest) => new Promise<LoanRequest>(async (resolve, reject) => {
    try {
      let request = await this._loanRequestService.update(loanRequest);
      resolve(request);
    } catch (err: any) {
      reject(err);
    }
  })

  private getMaturityDate(dateFunded: any, tenure: number, denominator: string) {
    let funded = moment(dateFunded);
    let d: any = denominator == "Months" ? "months" : "days";
    return funded.add(tenure, d);
  }
  updateStatus = ({ requestStatus, id, failureReason, message }: any) => new Promise<any>(async (resolve, reject) => {
    try {
      let loanRequest = await this._loanRequestService.getById(id);
      if (!loanRequest || Object.keys(loanRequest).length == 0) throw "Invalid Loan Request";
      let customer: any = await this._customerRepository.getById(loanRequest.customerID);
      if (!customer || Object.keys(customer).length == 0) throw "Invalid Customer";
      customer = customer.dataValues as Customer;
      let loanRequestLog = await this._loanRequestLogService.getByLoanRequestIDAndRequestDate({ loanRequestID: loanRequest.id, requestDate: loanRequest.requestDate })
      if (!loanRequestLog || Object.keys(loanRequestLog).length == 0) throw "Invalid Loan Request log";
      loanRequestLog = loanRequestLog.dataValues;
      // let status = requestStatus as unknown as LoanRequestStatus;
      loanRequest.requestStatus = requestStatus;
      loanRequest.updatedAt = new Date();
      if (requestStatus == LoanRequestStatus.Processing) {
        loanRequest.dateProcessed = new Date();
        loanRequestLog.dateProcessed = new Date();
      } else if (requestStatus == LoanRequestStatus.Approved) {
        loanRequest.dateApproved = new Date();
        loanRequestLog.dateApproved = new Date();
      } else if (requestStatus == LoanRequestStatus.NotQualified) {
        loanRequest.dateDeclined = new Date();
        loanRequest.failureReason = failureReason;
        loanRequestLog.dateDeclined = new Date();
        loanRequestLog.failureReason = failureReason;
      }
      else if (requestStatus == LoanRequestStatus.Approved) {
        loanRequest.dateDueForDisbursement = new Date();
        loanRequestLog.dateDueForDisbursement = new Date();
      }
      else if (requestStatus == LoanRequestStatus.Funded) {
        if (!loanRequest.dateDueForDisbursement) {
          loanRequest.dateDueForDisbursement = new Date();
          loanRequestLog.dateDueForDisbursement = new Date();
        }
        loanRequest.dateApproved = new Date();
        loanRequestLog.dateApproved = new Date();
        loanRequest.maturityDate = moment().add(loanRequest.tenure, loanRequest.denominator == "Months" ? "month" : "day").format("MMMM Do YYYY");

      }
      await this._loanRequestService.update(loanRequest);

      loanRequestLog.requestStatus = requestStatus;
      loanRequestLog.updatedAt = new Date();
      await this._loanRequestLogRepository.update(loanRequestLog);
      if (requestStatus == LoanRequestStatus.Funded) {
        //create disbursed loan record
        let disbursedLoans = new DisbursedLoan();
        disbursedLoans.new(loanRequest, loanRequestLog);
        disbursedLoans.code = this._utilService.autogenerate({ prefix: "DISB" });
        disbursedLoans.maturityDate = this.getMaturityDate(loanRequest.dateApproved, loanRequest.tenure, loanRequest.denominator).toDate();
        let dLoanInDb = await this._disbursedLoanRepository.create(disbursedLoans);
      }
      let notification = new WebNotification();
      notification.body = `Your loan request status for LOAN ID:${loanRequest.requestId} has been updated to ${requestStatus}`;
      if (failureReason) notification.body += `<br/><br/> Reason for Failure: ${failureReason}`;
      notification.title = `Vanaheim: Loan Status Update`
      notification.data = new WebNotData();
      notification.data.url = this._appConfig.WEBURL + "/my/loans";
      await this._emailService.SendEmail({ subject: "Vanir Capital: Loan Status Update", html: failureReason ? this._templateService.STATUS_UPDATE_DECLINED(customer.firstName, message ?? requestStatus, loanRequest.requestId) : requestStatus == LoanRequestStatus.UpdateRequired ? this._templateService.STATUS_UPDATE_REQUIRED(requestStatus, loanRequest.requestId, `https://vanaheim2.herokuapp.com/my/loans/${loanRequestLog.id}`, message) : this._templateService.STATUS_UPDATE(requestStatus, loanRequest.requestId), to: customer.email, toCustomer: true });
      await this._notificationService.sendNotificationToMany({ customerIds: [loanRequest.customerID], notification })
      resolve({ status: true, data: loanRequest });
    } catch (err: any) {
      console.log(err)
      resolve({ status: false })
    }
  });

  restructure: (disbursedLoanId: number, repayment: number) => Promise<boolean>;
  processLoanRequest = (request: any, userData: any) => new Promise<any>(async (resolve, reject) => {
    try {
      const customer = await this._customerRepository.getByUserID(userData.id);
      if (!customer || Object.keys(customer).length == 0) {
        //not yet a customer
        throw "Not yet a customer, kindly register to be able to reapply";
      }
      let c = Object.assign(customer.dataValues as Customer, new Customer());
      // console.log("Customer",c)
      let { loanRequest, templates, loanRequestLog } = await this._loanRequestService.createLoanRequest(request, c);


      //Send Email to support and customer
      const loanApplication = request.loanApplication;

      let documentPath = [];
      if (loanApplication.documents) {
        let documents = JSON.parse(loanApplication.documents)
        for (let key in documents) {
          const d = documents[key];
          let docInDb: any = await this._documentService.getById(d.id);
          if (docInDb && Object.keys(docInDb).length > 0) {
            // let doc: Document = new Document();
            // Object.assign(doc, docInDb.dataValues as Document)
            documentPath.push(docInDb.url);
            docInDb.loanRequestID = loanRequest.requestId;
            docInDb.loanRequestLogID = loanRequestLog?.id;
            await this._documentService.update(docInDb)
          }
        }
      }

      if (loanApplication.bvn) {
        let bvnInfo = JSON.parse(loanApplication.bvn) as BVN;
        let bvnFileResponse = await this._documentService.getBVNDocument(bvnInfo.bvn, c.code);
        if (bvnFileResponse.status == true) {
          documentPath.push(bvnFileResponse.file.path);
        }
      }
      let { path, template }: any = await this._templateService.generatePDF("Loan Application", templates, customer.code + "/" + loanRequest.requestId)
      let sent = await this._emailService.SendEmail({ type: 'form', to: this._appConfig.ADMIN_EMAIL, attachment: path, filePaths: documentPath, html: template, toCustomer: false })
      await this._emailService.SendEmail({ type: 'form', to: customer.email, attachment: path, filePaths: null, html: this._templateService.SUCCESSFUL_LOAN_TEMPLATE(c ? (c.firstName + ' ' + c.lastName) : "Customer"), toCustomer: true })
      let notification: WebNotification = new WebNotification();
      notification.title = "Vanaheim by Vanir Capital";
      notification.body = "Your have successfully applied for a loan";
      notification.vibrate = [100, 50, 100]
      notification.icon = 'https://i.tracxn.com/logo/company/Capture_6b9f9292-b7c5-405a-93ff-3081c395624c.PNG?height=120&width=120';
      notification.data = new WebNotData();
      notification.data.url = this._appConfig.WEBURL + "/my/loans";
      await this._notificationService.sendNotificationToMany({ customerIds: [customer.id], notification })
      resolve({ status: true, data: { loanRequestId: loanRequest.requestId } });
    } catch (err: any) {
      console.log(err);
      resolve({ status: false, message: err instanceof Object ? err.message : err });
    }
  });


}