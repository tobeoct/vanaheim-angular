

import { PaymentType } from "@enums/paymenttype";
import { BaseEntity } from "../base-entity";
import { DisbursedLoan } from "./disbursed-loan";

export class Repayment extends BaseEntity{
    disbursedLoan:DisbursedLoan
    amount:number;
    dateRepaid:Date;
    repaymentType:PaymentType;
    loanRequestId:string;
     accountNumber:string;

}