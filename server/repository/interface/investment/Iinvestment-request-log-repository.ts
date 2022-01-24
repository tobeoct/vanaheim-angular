import { EarningRequestStatus } from "@enums/investmentrequeststatus";
import { EarningRequestLog } from "@entities/investment/investment-request-log";
import { IBaseRepository } from "../Ibase-repository";

export interface IEarningRequestLogRepository extends IBaseRepository<EarningRequestLog>{
    getByCustomerID:(customerID:number)=>Promise<EarningRequestLog>
    getByEarningRequestID:(earningRequestID:number)=>Promise<EarningRequestLog>;
    getEarningByStatus:(customerID:number, status:EarningRequestStatus|any, include?:any[])=>Promise<EarningRequestLog[]>;
  
}