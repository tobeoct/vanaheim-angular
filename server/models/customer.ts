import { Gender } from "@enums/gender";
import { MaritalStatus } from "@enums/maritalstatus";
import { BaseEntity } from "./base-entity";
import { NOK } from "./nok";

export class Customer extends BaseEntity{
    firstname:string;
    othernames:string;
    surname:string;
    address:string;
    email:string;
    phonenumber:string;
    dateOfBirth:string;
     gender:Gender;
     maritalStatus:MaritalStatus;
     BVN:string;
     NOK:NOK;
    customerid:string;
}