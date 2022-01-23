import { LoanRequest } from "@entities/loan/loan-request";
import { IBaseRepository } from "../Ibase-repository";

export interface ILoanRequestRepository extends IBaseRepository<LoanRequest>{
    getByCustomerID:(customerID:number)=>Promise<LoanRequest>
    getByRequestID:(requestId:string)=>Promise<LoanRequest>
}