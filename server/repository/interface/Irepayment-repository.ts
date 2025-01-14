import { Repayment } from "@models/loan/repayment";
import { IBaseRepository } from "./Ibase-repository";

export interface IRepaymentRepository extends IBaseRepository<Repayment>{
    getByDisbursedLoanID:(disbursedLoanID:number)=>Promise<Repayment[]>
}