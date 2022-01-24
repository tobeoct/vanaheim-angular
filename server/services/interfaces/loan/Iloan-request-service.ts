import { LoanRequest } from "@entities/loan/loan-request";
import { BaseResponse } from "@services/implementation/base-service";
import { SearchResponse } from "@services/implementation/loan/loan-request-service";
import { IBaseService } from "../Ibaseservice";

export interface ILoanRequestService extends IBaseService<LoanRequest>{
    createLoanRequest:(request:any,customer:any)=>Promise<any>;
    search:(parameters:any,customer?:any)=>Promise<BaseResponse<SearchResponse<any[]>>>
    getLatestLoan:(userData:any) => Promise<any>
}
