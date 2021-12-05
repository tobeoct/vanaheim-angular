import { BaseEntity } from "@models/base-entity";
import { ApprovedEarning } from "./approved-investment";

export class EarningLiquidation extends BaseEntity {
    approvedEarningID:number
    ApprovedEarning:ApprovedEarning;
    amount:number;
    liquidationStatus:LiquidationStatus;
    datePaused?:Date;
    duration:number;
}


export enum LiquidationStatus{
    Pending="Pending",
    EarningPaused='EarningPaused',
    Processed="Processed"
}