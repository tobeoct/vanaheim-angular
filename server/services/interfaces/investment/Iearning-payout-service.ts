import { Customer } from "@entities/customer";
import { EarningPayout } from "@entities/investment/investment-payout";
import { IBaseService } from "@services/interfaces/Ibaseservice";


export interface IEarningPayoutService  extends IBaseService<EarningPayout>{
    processEarningPayoutPlan:({ email,tenure,loanType,denominator,purpose, rate, loanAmount, monthlyEarningPayout }:any, userData:any)=>Promise<any>;
    processEarningPayout:({amount,approvedEarningId }:any)=>Promise<any>;
    getByApprovedEarningID:(approvedEarningID:number)=>Promise<EarningPayout[]>
    getEarningPayoutHealth: (approvedEarningId: number) =>Promise<any>;
    getTotalEarningPayout: (approvedEarningId: number) => Promise<number>;
}
