import { EarningRequest } from "@entities/investment/investment-request";
import { SearchResponse } from "@models/search-response";
import { BaseResponse } from "@services/implementation/base-service";
import { IBaseService } from "../Ibaseservice";

export interface IEarningRequestService extends IBaseService<EarningRequest>{
    search:(parameters:any,customer?:any)=>Promise<BaseResponse<SearchResponse<any[]>>>
    getLatestEarnings:(userData:any) => Promise<any[]>
}
