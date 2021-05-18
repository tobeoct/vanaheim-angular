
import { Address } from "src/app/shared/interfaces/address";
import { DOB } from "src/app/shared/interfaces/dob";

export interface PersonalInfo{
    surname:string;
    title:string;
    firstName:string;
    otherNames:string;
    email:string;
    phoneNumber:string;
    dob:DOB;
   address:Address;
}
