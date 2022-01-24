import { EarningRequest } from "@entities/investment/investment-request";
import { EarningRequestLog } from "@entities/investment/investment-request-log";
import { IEarningRepository } from "@repository/interface/investment/Iinvestment-repository";

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