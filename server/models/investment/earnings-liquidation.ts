import { BaseEntity } from "@models/base-entity";
import { Customer } from "@models/customer";
import { ApprovedEarning } from "./approved-investment";

export class EarningLiquidation extends BaseEntity {
    approvedEarningID:number
    ApprovedEarning:ApprovedEarning;
    customerID:number;
    Customer:Customer;
    amount:number;
    liquidationStatus:LiquidationStatus;
    datePaused?:Date;
    duration:number;
}


export enum LiquidationStatus{
    Pending="Pending",
    EarningPaused='EarningPaused',
    Processed="Processed",
    Declined="Declined"
}