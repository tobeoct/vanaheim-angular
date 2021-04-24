
import { BaseEntity } from "./base-entity";
import { Customer } from "./customer";

export class Account extends BaseEntity{
    customer:Customer;
     bank:string;
     number:string;
    name:string;
}