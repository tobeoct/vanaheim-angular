import { BaseEntity } from "./base-entity";


export class Document extends BaseEntity{
    
   name:string;
   url:string;
   extension:string;
   fileName:string;
   requirement:string;
   customerID:number;
   loanRequestID:string;
   loanRequestLogID:number;
}