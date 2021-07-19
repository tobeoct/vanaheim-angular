import { DisbursedLoan } from "@models/loan/disbursed-loan";

export interface IDisbursedLoanService{
    getDisbursedLoanById:(loanRequestID:number)=>Promise<any>
    getDisbursedLoansById:(loanRequestID:number)=>Promise<any>
    getDisbursedLoanWithRepayment:(loanRequestID:number)=>Promise<any>

}
