import { BaseEntity } from "./base-entity";


export class Document extends BaseEntity{
    
   name:string;
   url:string;
   extension:string;
   fileName:string;
   path:string;
   requirement:string;
   customerID:number;
   requestId:string;
}