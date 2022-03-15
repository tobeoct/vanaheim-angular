
import { EarningLiquidation } from "@entities/investment/earnings-liquidation";
import { LiquidationStatus } from "@enums/liquidationStatus";
import { SearchResponse } from "@models/search-response";
import { IBaseRepository } from "../Ibase-repository";

export interface IEarningLiquidationRepository extends IBaseRepository<EarningLiquidation>{
    getByStatus: (status?:LiquidationStatus,include?:any[]) => Promise<SearchResponse<EarningLiquidation[]>>

    getByApprovedEarningID: (approvedEarningID:number,pageNumber:number,maxSize:number,include?:any[]) => Promise<SearchResponse<EarningLiquidation[]>>
}