
import { EarningRequestLog } from "@models/investment/investment-request-log";
import { BaseResponse } from "@services/implementation/base-service";
import {IBaseService } from "../Ibaseservice";

export interface IEarningRequestLogService extends IBaseService<EarningRequestLog>{
    search:(parameters:any,customer?:any)=>Promise<any>
    getByEarningRequestIDAndRequestDate:({requestDate,earningRequestID}:any) => Promise<EarningRequestLog>
}
