import { Customer } from "@models/customer";
import { LoanTypeRequirements } from "@models/loan/loan-type-requirements";
import { IBaseService } from "../Ibaseservice";

export interface ILoanTypeRequirementService extends IBaseService<LoanTypeRequirements>{
    search:(parameters:any,customer?:any)=>Promise<any>
    getByIdExtended:(id:number)=>Promise<any>
    createLoanRequirement: (loanApplication:any,category:string,customer:Customer) =>Promise<any>
}
