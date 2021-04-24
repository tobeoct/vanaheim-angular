
import { PaymentType } from "@enums/paymenttype";
import { BaseEntity } from "@models/base-entity";
import { ApprovedInvestment } from "./approved-investment";

export class InvestmentPayout extends BaseEntity{
    approvedInvestment:ApprovedInvestment;
    amount:string;
    datePaid:Date;
    payoutType:PaymentType;
    investmentRequestId:string;
}