
import { PaymentType } from "server/enums/paymenttype";
import { BaseEntity } from "server/entities/base-entity";
import { ApprovedEarning } from "./approved-investment";

export class EarningPayout extends BaseEntity{
    approvedInvestment:ApprovedEarning;
    amount:string;
    datePaid:Date;
    payoutType:PaymentType;
    investmentRequestId:string;
}