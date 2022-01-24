
import { TopUpStatus } from "@enums/topUpStatus";
import { BaseEntity } from "../base-entity";
import { Customer } from "../customer";
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
