
import { EarningType } from "@enums/earningtype";
import { PaymentType } from "@enums/paymenttype";
import { BaseEntity } from "../base-entity";
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