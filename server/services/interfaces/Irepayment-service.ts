import { Repayment } from "@models/loan/repayment";
import { IBaseService } from "./Ibaseservice";

export interface IRepaymentService  extends IBaseService<Repayment>{
    processRepaymentPlan:({ email,tenure,loanType,denominator,purpose, rate, loanAmount, monthlyRepayment }:any, userData:any)=>Promise<any>;
    processRepayment:({amount,disbursedLoanId }:any)=>Promise<any>;
    getByDisbursedLoanID:(disbursedLoanID:number)=>Promise<Repayment[]>
    getRepaymentHealth: (disbursedLoanId: number) =>Promise<any>;
    getTotalRepayment: (disbursedLoanId: number) => Promise<number>;
}
