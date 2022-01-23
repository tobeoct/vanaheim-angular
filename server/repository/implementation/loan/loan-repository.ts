import { LoanRequest } from "@entities/loan/loan-request";
import { LoanRequestLog } from "@entities/loan/loan-request-log";
import { ILoanRepository } from "@repository/interface/loan/Iloan-repository";


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