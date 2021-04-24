import { InvestmentRequest } from "@models/investment/investment-request";
import { InvestmentRequestLog } from "@models/investment/investment-request-log";

export interface IInvestmentRepository{
    restructure:(approvedInvestmentId:number,payout:number)=>Promise<boolean>
    getAllInvestmentRequests:()=>Promise<InvestmentRequest[]>
    getAllInvestmentRequestLogs:()=>Promise<InvestmentRequestLog[]>
    getInvestmentRequestById:()=>Promise<InvestmentRequest>
    getInvestmentRequestLogById:()=>Promise<InvestmentRequestLog>
    updateInvestmentRequest:(investmentRequest:InvestmentRequest)=> Promise<InvestmentRequest>
}