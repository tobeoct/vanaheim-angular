import { Gender } from "@enums/gender";
import { BaseEntity } from "./base-entity";
import { UserRole } from "./user-role";

export class Staff extends BaseEntity{
    firstname:string;
    othernames:string;
    surname:string;
    role:UserRole;
    address:string;
    phoneNumber:string;
    position:string;
    email:string;
    gender:Gender;
    dateOfBirth:string;
    staffId:string
}