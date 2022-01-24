import { EarningPayout } from "@entities/investment/investment-payout";
import { IBaseRepository } from "../Ibase-repository";

export interface IEarningPayoutRepository extends IBaseRepository<EarningPayout>{
    getByApprovedEarningID:(approvedEarningID:number)=>Promise<EarningPayout[]>
    getPayoutSoFar:(approvedEarningID: number) =>  Promise<any[]>;
}