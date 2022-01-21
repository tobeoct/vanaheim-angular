import { BaseEntity } from "@models/base-entity";
import { Customer } from "@models/customer";
import { ApprovedEarning } from "./approved-investment";

export class EarningTopUp extends BaseEntity {
    approvedEarningID:number
    ApprovedEarning:ApprovedEarning;
    customerID:number;
    Customer:Customer;
    amount:number;
    topUpStatus:TopUpStatus;
    duration:number;
}
export enum TopUpStatus{
    Pending="Pending",
    Processed="Processed"
}
