import { BaseEntity } from "./base-entity";
import { Customer } from "./customer";
import { Subscription } from "./subscription";

export class Device extends BaseEntity{
    browserID:string;
    customerID:number;
    customer:Customer;
    subscriptions:Subscription[];
}