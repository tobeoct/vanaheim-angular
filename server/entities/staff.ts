import { Gender } from "server/enums/gender";
import { BaseEntity } from "./base-entity";
import { UserRole } from "./user-role";

export class Staff extends BaseEntity{
    firstName:string;
    otherNames:string;
    lastName:string;
    role:UserRole;
    address:string;
    phoneNumber:string;
    position:string;
    email:string;
    gender:Gender;
    dateOfBirth:string;
    userID:number;
    staffId:string
}