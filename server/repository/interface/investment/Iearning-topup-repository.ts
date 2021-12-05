
import { EarningTopUp, TopUpStatus } from "@models/investment/earnings-topup";
import { SearchResponse } from "@models/search-response";
import { IBaseRepository } from "../Ibase-repository";

export interface IEarningTopUpRepository extends IBaseRepository<EarningTopUp>{
    getByStatus: (status?:TopUpStatus) => Promise<SearchResponse<EarningTopUp[]>>
    getActiveTopUps: (approvedEarningID:number) => Promise<SearchResponse<EarningTopUp[]>>

    getByApprovedEarningID: (approvedEarningID:number,amount:number) => Promise<EarningTopUp>
}