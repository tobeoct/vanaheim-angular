import { Gender } from "@enums/gender";
import { MaritalStatus } from "@enums/maritalstatus";
import { BaseEntity } from "./base-entity";
import { ContactDetails } from "./contact-details";


export class Shareholder extends BaseEntity implements ContactDetails{
   email: string;
   street: string;
   city: string;
   title:string;
   surname:string;
   otherNames:string;
   dateOfBirth:Date;
   gender:Gender;
   maritalStatus:MaritalStatus;
   educationalQualifications:string;
   designation:string;
   phoneNumber:string;
   state:string;

}