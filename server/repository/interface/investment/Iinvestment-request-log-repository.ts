import { EarningRequestStatus } from "@models/helpers/enums/investmentrequeststatus";
import { EarningRequestLog } from "@models/investment/investment-request-log";
import { IBaseRepository } from "../Ibase-repository";

export interface IEarningRequestLogRepository extends IBaseRepository<EarningRequestLog>{
    getByCustomerID:(customerID:number)=>Promise<EarningRequestLog>
    getByEarningRequestID:(earningRequestID:number)=>Promise<EarningRequestLog>;
    getEarningByStatus:(customerID:number, status:EarningRequestStatus|any, include?:any[])=>Promise<EarningRequestLog[]>;
  
}