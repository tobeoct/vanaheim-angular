import { LoanRequest } from "@models/loan/loan-request";
import { IBaseService } from "../Ibaseservice";

export interface ILoanRequestService extends IBaseService<LoanRequest>{
    createLoanRequest:(request:any,customer:any)=>Promise<any>;
    search:(parameters:any,userData:any)=>Promise<any>
    getLatestLoan:(userData:any) => Promise<any>
}
