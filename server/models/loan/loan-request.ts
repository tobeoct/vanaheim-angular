import { LoanRequestStatus } from "@enums/loanrequeststatus";
import { Account } from "@models/account";
import { BaseEntity } from "@models/base-entity";
import { Customer } from "@models/customer";
import { LoanType } from "./loan-type";

export class LoanRequest extends BaseEntity{
    customer:Customer;
     loanProduct:string;
     tenure:number;
     amount:number;
     account:Account;
     requestDate:Date;
     dateApproved:Date;
     dateProcessed:Date;
     dateDeclined:Date;
     failureReason:string;
    requestStatus:LoanRequestStatus;
    dateDueForDisbursement:Date;
     loanType:LoanType;
     loanPurpose:string;
     applyingAs:string;
workflow:any;
    loanTypeRequirements:any;
    requestId:string;

}