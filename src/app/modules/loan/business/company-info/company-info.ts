
import { Address } from "src/app/shared/interfaces/address";
import { DOB } from "src/app/shared/interfaces/dob";

export class CompanyInfo{
    id:number=0;
    companyName:string;
    companyRCNo:string;
    natureOfBusiness:string;
    dateOfIncorporation:DOB;
    timeInBusiness:string;
   address:Address;
   phoneNumber:string;
   email:string;
}
