import { LoanRequest } from "@entities/loan/loan-request";
import { LoanRequestLog } from "@entities/loan/loan-request-log";

export interface ILoanRepository{
    restructure:(disbursedLoanId:number,repayment:number)=>Promise<boolean>
    getAllLoanRequests:()=>Promise<LoanRequest[]>
    getAllLoanRequestLogs:()=>Promise<LoanRequestLog[]>
    getLoanRequestById:()=>Promise<LoanRequest>
    getLoanRequestLogById:()=>Promise<LoanRequestLog>
    updateLoanRequest:(loanRequest:LoanRequest)=> Promise<LoanRequest>
}