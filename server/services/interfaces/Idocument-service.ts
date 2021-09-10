import { Customer } from "@models/customer";
import { Document } from "@models/document";
import { DocumentUpload } from "src/app/modules/loan/shared/document-upload/document";
import { IBaseService } from "./Ibaseservice";

export interface IDocumentService extends IBaseService<Document>{
    getByCustomerID: (customerID:number) => Promise<any>;
    processDocument:(documentUpload:DocumentUpload,customer:Customer)=>Promise<any>
    getBVNDocument:(bvn:string,customerCode:string)=>Promise<any>
    getByLoanRequestId:(loanRequestId:number)=>Promise<any>
}
