import {LoanTypeRequirements } from "@models/loan/loan-type-requirements";
import { IBaseRepository } from "./Ibase-repository";

export interface ILoanTypeRequirementRepository extends IBaseRepository<LoanTypeRequirements>{
    getByLoanRequestLogID: (requestLogID:number) => Promise<any>
}