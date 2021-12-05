import { BaseEntity } from "@models/base-entity";
import { ApprovedEarning } from "./approved-investment";

export class EarningTopUp extends BaseEntity {
    approvedEarningID:number
    ApprovedEarning:ApprovedEarning;
    amount:number;
    topUpStatus:TopUpStatus;
    duration:number;
}
export enum TopUpStatus{
    Pending="Pending",
    Processed="Processed"
}
