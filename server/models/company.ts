import { BaseEntity } from "./base-entity";
import { ContactDetails } from "./contact-details";


export class Company extends BaseEntity implements ContactDetails{
    
   name:string;
   rcNo:string;
   natureOfBusiness:string;
   dateOfIncorporation:Date;
   timeInBusiness:string;
   phoneNumber:string;
   email:string;
   street:string;
   city:string;
   state:string;

}