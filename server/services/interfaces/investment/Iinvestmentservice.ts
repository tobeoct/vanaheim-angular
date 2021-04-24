import { InvestmentRequest } from "@models/investment/investment-request";
import { InvestmentRequestLog } from "@models/investment/investment-request-log";
import { IInvestmentRequestLogService } from "./Iinvestment-log-request-service";
import { IInvestmentRequestService } from "./Iinvestment-request-service";


export interface IInvestmentService{

    restructure:(disbursedInvestmentId:number,repayment:number)=>Promise<boolean>
    getAllInvestmentRequests:()=>Promise<InvestmentRequest[]>
    getAllInvestmentRequestLogs:()=>Promise<InvestmentRequestLog[]>
    getInvestmentRequestById:()=>Promise<InvestmentRequest>
    getInvestmentRequestLogById:()=>Promise<InvestmentRequestLog>
    updateInvestmentRequest:(investmentRequest:InvestmentRequest)=> Promise<InvestmentRequest>

}
