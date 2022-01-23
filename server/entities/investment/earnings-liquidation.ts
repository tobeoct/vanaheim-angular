
import { LiquidationStatus } from "@enums/liquidationStatus";
import { BaseEntity } from "../base-entity";
import { Customer } from "../customer";
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

