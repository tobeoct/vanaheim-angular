
import { LoanRequestLog } from "@models/loan/loan-request-log";
import { IBaseService } from "../Ibaseservice";

export interface ILoanRequestLogService extends IBaseService<LoanRequestLog>{

    search:(parameters:any,customer?:any)=>Promise<any>
    getByLoanRequestIDAndRequestDate:({requestDate,loanRequestID}:any) => Promise<any>
}

