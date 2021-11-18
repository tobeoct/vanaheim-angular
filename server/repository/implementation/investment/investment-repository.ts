import { EarningRequest } from "@models/investment/investment-request";
import { EarningRequestLog } from "@models/investment/investment-request-log";
import { IEarningRepository } from "@repository/interface/investment/Iinvestment-repository";
import { IEarningRequestRepository } from "@repository/interface/investment/Iinvestment-request-repository";
import { IEarningRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";


 export class EarningRepository implements IEarningRepository{
  //  constructor(private _earningRequestRepository:IEarningRequestRepository,private _earningRequestLogRepository:IEarningRequestLogRepository){

  //  }
   restructure: (approvedEarningId: number, payout: number) => Promise<boolean>;
   getAllEarningRequests: () => Promise<EarningRequest[]>;
   getAllEarningRequestLogs: () => Promise<EarningRequestLog[]>;
   getEarningRequestById: () => Promise<EarningRequest>;
   getEarningRequestLogById: () => Promise<EarningRequestLog>;
   updateEarningRequest: (investmentRequest: EarningRequest) => Promise<EarningRequest>;
}