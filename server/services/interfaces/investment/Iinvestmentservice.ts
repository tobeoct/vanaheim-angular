import { Customer } from "@entities/customer";
import { EarningRequest } from "@entities/investment/investment-request";
import { EarningRequestLog } from "@entities/investment/investment-request-log";
import { LiquidationStatus } from "@enums/liquidationStatus";
import { EarningApplication } from "src/app/modules/earnings/earnings-application";

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
    process:(customer:Customer,payload:EarningApplication) => Promise<any>
    topUp:(id:number)=>Promise<any>
    liquidate:(id:number,status?:LiquidationStatus)=>Promise<any>
}
