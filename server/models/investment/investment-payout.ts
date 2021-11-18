
import { PaymentType } from "@enums/paymenttype";
import { BaseEntity } from "@models/base-entity";
import { ApprovedEarning } from "./approved-investment";

export class EarningPayout extends BaseEntity{
    approvedEarning:ApprovedEarning;
    amount:string;
    datePaid:Date;
    payoutType:PaymentType;
    investmentRequestId:string;
}