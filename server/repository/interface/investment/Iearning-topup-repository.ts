
import { EarningTopUp } from "@entities/investment/earnings-topup";
import { TopUpStatus } from "@enums/topUpStatus";
import { SearchResponse } from "@models/search-response";
import { IBaseRepository } from "../Ibase-repository";

export interface IEarningTopUpRepository extends IBaseRepository<EarningTopUp>{
    getByStatus: (status?:TopUpStatus,include?:any[]) => Promise<SearchResponse<EarningTopUp[]>>
    getActiveTopUps: (approvedEarningID:number,include?:any[]) => Promise<SearchResponse<EarningTopUp[]>>

    getByApprovedEarningID: (approvedEarningID:number,amount:number,include?:any[]) => Promise<EarningTopUp>
}