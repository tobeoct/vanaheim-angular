import { Document } from "@entities/document";
import { IBaseRepository } from "../Ibase-repository";

export interface IDocumentRepository extends IBaseRepository<Document>{
    getByCustomerID: (customerID:number) => Promise<any[]>
    getByRequestId:(requestId:string)=>Promise<any[]>
}