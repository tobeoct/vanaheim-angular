import { LoanRequestLog } from "@models/loan/loan-request-log";
import { IBaseRepository } from "../Ibase-repository";

export interface ILoanRequestLogRepository extends IBaseRepository<LoanRequestLog>{
    getByCustomerID:(customerID:number)=>Promise<LoanRequestLog>
    getByLoanRequestID:(loanRequestID:number)=>Promise<LoanRequestLog>
}