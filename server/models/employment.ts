
import { BaseEntity } from "./base-entity";
import { ContactDetails } from "./contact-details";


export class Employment extends BaseEntity implements ContactDetails{
   email: string;
   street: string;
   city: string;
   employer:string;
   surname:string;
   businessSector:string;
   netMonthlyAmount:string;
   payday:number;
   phoneNumber:string;
   state:string;

}