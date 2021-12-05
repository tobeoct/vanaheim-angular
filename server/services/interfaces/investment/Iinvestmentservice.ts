import { Customer } from "@models/customer";
import { LiquidationStatus } from "@models/investment/earnings-liquidation";
import { EarningPayload } from "@models/investment/investment-payload";
import { EarningRequest } from "@models/investment/investment-request";
import { EarningRequestLog } from "@models/investment/investment-request-log";

export interface IEarningService{

    restructure:(disbursedEarningId:number,repayment:number)=>Promise<boolean>
    getAllEarningRequests:()=>Promise<EarningRequest[]>
    getAllEarningRequestLogs:()=>Promise<EarningRequestLog[]>
    getEarningRequestById:()=>Promise<EarningRequest>
    getEarningRequestLogById:()=>Promise<EarningRequestLog>
    updateEarningRequest:(loanRequest:EarningRequest)=> Promise<EarningRequest>
    processEarningRequest:(request:any,userData:any)=> Promise<EarningRequest>
    updateStatus:({requestStatus,id,failureReason,message}:any)=>Promise<any>
    getEarningDetails:(id:number, type:string)=>Promise<any>
    getAllEarningDetails:(customerId:number, type:string)=>Promise<any>
    process:(customer:Customer,payload:EarningPayload) => Promise<any>
    topUp:(id:number)=>Promise<any>
    liquidate:(id:number,status?:LiquidationStatus)=>Promise<any>
}
