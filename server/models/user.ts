import { UserCategory } from "src/shared/constants/enum";
import { BaseEntity } from "@models/base-entity";
import { Customer } from "@models/customer";
import { Staff } from "@models/staff";

export class User extends BaseEntity{
    username:string;
    passwordSalt:string;
     passwordHash:string;
     passwordRetries:string;
     category:UserCategory;
     customer!:Customer;
     staff!:Staff;
     name:string;
     email:string;
     token:string;
     tokenExpirationDate:Date;
     phoneNumber:string;
}