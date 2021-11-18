import { EarningRequest } from "@models/investment/investment-request";
import { EarningRequestLog } from "@models/investment/investment-request-log";

export interface IEarningRepository{
    restructure:(approvedEarningId:number,payout:number)=>Promise<boolean>
    getAllEarningRequests:()=>Promise<EarningRequest[]>
    getAllEarningRequestLogs:()=>Promise<EarningRequestLog[]>
    getEarningRequestById:()=>Promise<EarningRequest>
    getEarningRequestLogById:()=>Promise<EarningRequestLog>
    updateEarningRequest:(investmentRequest:EarningRequest)=> Promise<EarningRequest>
}