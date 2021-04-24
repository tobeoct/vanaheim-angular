import { LoanRequest } from "@models/loan/loan-request";
import { LoanRequestLog } from "@models/loan/loan-request-log";
import { ILoanRepository } from "@repository/interface/loan/Iloan-repository";
import { ILoanRequestRepository } from "@repository/interface/loan/Iloan-request-repository";
import { ILoanRequestLogRepository } from "@repository/interface/loan/Iloan-request-log-repository";


 export class LoanRepository implements ILoanRepository{
  //  constructor(private _loanRequestRepository:ILoanRequestRepository,private _loanRequestLogRepository:ILoanRequestLogRepository){

  //  }
   restructure: (disbursedLoanId: number, repayment: number) => Promise<boolean>;
   getAllLoanRequests: () => Promise<LoanRequest[]>;
   getAllLoanRequestLogs: () => Promise<LoanRequestLog[]>;
   getLoanRequestById: () => Promise<LoanRequest>;
   getLoanRequestLogById: () => Promise<LoanRequestLog>;
   updateLoanRequest: (loanRequest: LoanRequest) => Promise<LoanRequest>;
}