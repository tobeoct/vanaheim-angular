

import { PaymentType } from "server/enums/paymenttype";
import { BaseEntity } from "../base-entity";
import { DisbursedLoan } from "./disbursed-loan";

export class Repayment extends BaseEntity{
    disbursedLoan:DisbursedLoan
    amount:number;
    dateRepaid:Date;
    repaymentType:PaymentType;
    loanRequestID:number;
    disbursedLoanID:number;
     accountNumber:string;

}