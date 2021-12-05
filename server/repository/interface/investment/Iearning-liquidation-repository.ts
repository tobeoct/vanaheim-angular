
import { EarningLiquidation, LiquidationStatus } from "@models/investment/earnings-liquidation";
import { SearchResponse } from "@models/search-response";
import { IBaseRepository } from "../Ibase-repository";

export interface IEarningLiquidationRepository extends IBaseRepository<EarningLiquidation>{
    getByStatus: (status?:LiquidationStatus) => Promise<SearchResponse<EarningLiquidation[]>>

    getByApprovedEarningID: (approvedEarningID:number) => Promise<EarningLiquidation>
}