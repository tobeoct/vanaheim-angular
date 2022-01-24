import { UserCategory } from "@enums/usercategory";
import { BaseEntity } from "./base-entity";
import { Customer } from "./customer";
import { Staff } from "./staff";

export class User extends BaseEntity {
    username: string;
    passwordSalt: string;
    passwordHash: string;
    passwordRetries: string;
    category: UserCategory;
    customer!: Customer;
    staff!: Staff;
    name: string;
    email: string;
    token: string;
    tokenExpirationDate: Date;
    phoneNumber: string;
}