import { UserCategory } from "server/enums/usercategory";
import { BaseEntity } from "server/entities/base-entity";
import { Customer } from "server/entities/customer";
import { Staff } from "server/entities/staff";

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