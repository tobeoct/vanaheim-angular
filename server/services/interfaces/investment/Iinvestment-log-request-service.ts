
import { EarningRequestLog } from "@entities/investment/investment-request-log";
import {IBaseService } from "../Ibaseservice";

export interface IEarningRequestLogService extends IBaseService<EarningRequestLog>{
    search:(parameters:any,customer?:any)=>Promise<any>
    getByEarningRequestIDAndRequestDate:({requestDate,earningRequestID}:any) => Promise<EarningRequestLog>
}
