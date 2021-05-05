import { Gender } from "@enums/gender";
import { MaritalStatus } from "@enums/maritalstatus";
import { BaseEntity } from "./base-entity";
import { NOK } from "./nok";

export class Customer extends BaseEntity{
    firstName:string;
    otherNames:string;
    lastName:string;
    address:string;
    email:string;
    phoneNumber:string;
    dateOfBirth:string;
     gender:Gender;
     maritalStatus:MaritalStatus;
     BVN:string;
     NOK:NOK;
    customerid:string;
    userID:number;
}