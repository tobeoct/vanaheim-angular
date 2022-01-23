import { LoanRequest } from "@entities/loan/loan-request";
import { LoanRequestLog } from "@entities/loan/loan-request-log";

export interface ILoanService{

    restructure:(disbursedLoanId:number,repayment:number)=>Promise<boolean>
    getAllLoanRequests:()=>Promise<LoanRequest[]>
    getAllLoanRequestLogs:()=>Promise<LoanRequestLog[]>
    getLoanRequestById:()=>Promise<LoanRequest>
    getLoanRequestLogById:()=>Promise<LoanRequestLog>
    updateLoanRequest:(loanRequest:LoanRequest)=> Promise<LoanRequest>
    processLoanRequest:(request:any,userData:any)=> Promise<LoanRequest>
    updateStatus:({requestStatus,id,failureReason,message}:any)=>Promise<any>
    getLoanDetails:(id:number, type:string)=>Promise<any>

}
