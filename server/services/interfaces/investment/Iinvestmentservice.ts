import { Customer } from "@models/customer";
import { EarningPayload } from "@models/investment/investment-payload";
import { EarningRequest } from "@models/investment/investment-request";
import { EarningRequestLog } from "@models/investment/investment-request-log";

export interface IEarningService{

    restructure:(disbursedEarningId:number,repayment:number)=>Promise<boolean>
    getAllEarningRequests:()=>Promise<EarningRequest[]>
    getAllEarningRequestLogs:()=>Promise<EarningRequestLog[]>
    getEarningRequestById:()=>Promise<EarningRequest>
    getEarningRequestLogById:()=>Promise<EarningRequestLog>
    updateEarningRequest:(investmentRequest:EarningRequest)=> Promise<EarningRequest>
    process:(customer:Customer,payload:EarningPayload) => Promise<any>
}
