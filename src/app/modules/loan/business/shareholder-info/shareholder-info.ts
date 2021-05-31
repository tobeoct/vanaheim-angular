import { Address } from "src/app/shared/interfaces/address";
import { DOB } from "src/app/shared/interfaces/dob";


export class ShareholderInfo{
    id:number=0;
    surname:string;
    title:string;
    otherNames:string;
    educationalQualification:string;
    gender:string;
    maritalStatus:string;
    designation:string;
    email:string;
    phoneNumber:string;
    dob:DOB;
   address:Address;
}
