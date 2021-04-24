import { InvestmentRequest } from "@models/investment/investment-request";
import { InvestmentRequestLog } from "@models/investment/investment-request-log";
import { IInvestmentRepository } from "@repository/interface/investment/Iinvestment-repository";
import { IInvestmentRequestRepository } from "@repository/interface/investment/Iinvestment-request-repository";
import { IInvestmentRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";


 export class InvestmentRepository implements IInvestmentRepository{
  //  constructor(private _investmentRequestRepository:IInvestmentRequestRepository,private _investmentRequestLogRepository:IInvestmentRequestLogRepository){

  //  }
   restructure: (approvedInvestmentId: number, payout: number) => Promise<boolean>;
   getAllInvestmentRequests: () => Promise<InvestmentRequest[]>;
   getAllInvestmentRequestLogs: () => Promise<InvestmentRequestLog[]>;
   getInvestmentRequestById: () => Promise<InvestmentRequest>;
   getInvestmentRequestLogById: () => Promise<InvestmentRequestLog>;
   updateInvestmentRequest: (investmentRequest: InvestmentRequest) => Promise<InvestmentRequest>;
}