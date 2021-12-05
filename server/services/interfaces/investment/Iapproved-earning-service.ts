import { ApprovedEarning } from "@models/investment/approved-investment";
import { BaseResponse } from "@services/implementation/base-service";
import { IBaseService } from "../Ibaseservice";

export interface IApprovedEarningService  extends IBaseService<ApprovedEarning>{
    getByEarningRequestId:(earningRequestID:number)=>Promise<BaseResponse<ApprovedEarning>>
    getByEarningRequestAndLogId:(earningRequestID:number,earningRequestLogID:number)=>Promise<BaseResponse<ApprovedEarning>>
    getAllByEarningRequestId:(earningRequestID:number)=>Promise<BaseResponse<ApprovedEarning[]>>
    getWithPayout:(earningRequestID:number)=>Promise<any>

}
