import { BaseEntity } from "./base-entity";


export class Collateral extends BaseEntity{
    
   name:string;
   description:string;
   valuation:number;
   document:Document;

}