import { LoanRequest } from "@models/loan/loan-request";
import { LoanRequestLog } from "@models/loan/loan-request-log";

export interface ILoanService{

    restructure:(disbursedLoanId:number,repayment:number)=>Promise<boolean>
    getAllLoanRequests:()=>Promise<LoanRequest[]>
    getAllLoanRequestLogs:()=>Promise<LoanRequestLog[]>
    getLoanRequestById:()=>Promise<LoanRequest>
    getLoanRequestLogById:()=>Promise<LoanRequestLog>
    updateLoanRequest:(loanRequest:LoanRequest)=> Promise<LoanRequest>

}
