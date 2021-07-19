import { DisbursedLoan } from "@models/loan/disbursed-loan";
import { LoanRequest } from "@models/loan/loan-request";
import { LoanRequestLog } from "@models/loan/loan-request-log";
import { IRepaymentRepository } from "@repository/interface/Irepayment-repository";
import { IDisbursedLoanRepository } from "@repository/interface/loan/Idisbursed-loan-repository";
import { ILoanRequestLogRepository } from "@repository/interface/loan/Iloan-request-log-repository";
import { ILoanRequestRepository } from "@repository/interface/loan/Iloan-request-repository";
import { IDisbursedLoanService } from "@services/interfaces/loan/Idisbursed-loan-service";
import moment = require("moment");

export class DisbursedLoanService implements IDisbursedLoanService {
  constructor(private _disbursedLoanRepository: IDisbursedLoanRepository, private _repaymentRepository: IRepaymentRepository, private _loanRequestRepository: ILoanRequestRepository, private _loanRequestLogRepository: ILoanRequestLogRepository) {

  }
  private getDisbursedLoan = (loanRequestID: number) => new Promise<DisbursedLoan>(async (resolve, reject) => {
    try {
      let loanRequest = await this._loanRequestRepository.getById(loanRequestID) as LoanRequest;

      if (!loanRequest) { console.log("getDisbursedLoanById => No loan request found"); reject("Cannot retrieve disbursed loan record"); return; }
      let loanRequestLog = await this._loanRequestLogRepository.search({ requestDate: loanRequest.requestDate, loanRequestID }, 0, 1);
      if (!loanRequestLog) { console.log("getDisbursedLoanById => No loan request log"); reject("Cannot retrieve disbursed loan record"); return; }
      let disbursedLoan = await this._disbursedLoanRepository.getByRequestAndLogID(loanRequestID, loanRequestLog.rows[0]?.id??0) as DisbursedLoan;
      resolve(disbursedLoan)
    } catch (err) {
      console.log(err);
      reject(err);
    }
  })
  private getDisbursedLoans = (loanRequestID: number) => new Promise<DisbursedLoan[]>(async (resolve, reject) => {
    let disbursedLoans = await this._disbursedLoanRepository.getByRequestID(loanRequestID);
    resolve(disbursedLoans);

  })
  getDisbursedLoanById = (loanRequestID: number) => new Promise<any>(async (resolve, reject) => {
    try {
      resolve({status:true,data: await this.getDisbursedLoan(loanRequestID)})
    } catch (err) {
      console.log(err);
      reject({ status: false, data: "We cannot fetch your details at the moment" });
    }
  })
  getDisbursedLoansById = (loanRequestID: number) => new Promise<any>(async (resolve, reject) => {
    try {
      resolve({status:true,data: await this.getDisbursedLoans(loanRequestID)})
    } catch (err) {
      console.log(err);
      reject({ status: false, data: "We cannot fetch your details at the moment" });
    }
  })

  getDisbursedLoanWithRepayment = (loanRequestID: number) => new Promise<any>(async (resolve, reject) => {
    try {
      let disbursedLoan = await this.getDisbursedLoan(loanRequestID);
      if (!disbursedLoan) resolve({ status: "No disbursed loan available" })
      let repayments = await this._repaymentRepository.getByDisbursedLoanID(disbursedLoan.id);
      resolve({status:true, data:{disbursedLoan,repayments}})
    } catch (err) {
      console.log("getDisbursedLoanWithRepayment=>" + err)
      resolve({ status: false, data: "We cannot fetch your details at the moment" })
    }
  })

}