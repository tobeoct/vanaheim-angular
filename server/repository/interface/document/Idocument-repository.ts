import { Document } from "@models/document";
import { IBaseRepository } from "../Ibase-repository";

export interface IDocumentRepository extends IBaseRepository<Document>{
    getByCustomerID: (customerID:number) => Promise<any[]>
    getByLoanRequestId:(loanRequestId:string)=>Promise<any[]>
    getByLoanRequest:(loanRequestId:number,loanRequestLogId:number)=>Promise<any[]>
}