
import { Address } from "src/app/shared/interfaces/address";
import { DOB } from "src/app/shared/interfaces/dob";

export interface NOKInfo{
    surname:string;
    title:string;
    otherNames:string;
    email:string;
    phoneNumber:string;
    dob:DOB;
   relationship:string;
}
