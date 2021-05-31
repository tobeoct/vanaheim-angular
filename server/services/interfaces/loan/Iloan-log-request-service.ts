
import { LoanRequestLog } from "@models/loan/loan-request-log";
import { IBaseService } from "../Ibaseservice";

export interface ILoanRequestLogService extends IBaseService<LoanRequestLog>{

    search:(parameters:any,userData:any)=>Promise<any>
    getByLoanRequestIDAndRequestDate:({requestDate,loanRequestID}:any) => Promise<any>
}

