
import { PaymentType } from "@enums/paymenttype";
import { BaseEntity } from "@models/base-entity";
import { EarningType } from "src/app/shared/services/earning/earning.service";
import { ApprovedEarning } from "./approved-investment";

export class EarningPayout extends BaseEntity{
    ApprovedEarning:ApprovedEarning;
    approvedEarningID:number;
    amount:string;
    datePaid:Date;
    payoutType:PaymentType;
    earningRequestId:string;
    type:EarningType;
    accountNumber:string;
    startingPrincipal:number
}