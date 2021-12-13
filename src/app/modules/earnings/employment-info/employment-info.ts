import { Address } from "src/app/shared/interfaces/address";


export class EarningsEmploymentInfo{
    id:number=0;
    previousEmployer:string
    currentEmployer:string; //current employer
    businessSector:string
    email:string;
    phoneNumber:string;
    address:Address;
}