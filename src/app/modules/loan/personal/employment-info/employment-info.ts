import { Address } from "src/app/shared/interfaces/address";


export interface EmploymentInfo{
    employer:string
    businessSector:string
    email:string;
    phoneNumber:string;
    address:Address;
    netMonthlySalary:number;
    payDay:string;
}
