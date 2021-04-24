

import { LoanStatus } from "@enums/loanstatus";
import { BaseEntity } from "@models/base-entity";
import { LoanRequest } from "./loan-request";
import { LoanRequestLog } from "./loan-request-log";

export class DisbursedLoan extends BaseEntity{
    dateDisbursed:Date;
     loanRequest:LoanRequest;
     loanRequestLog:LoanRequestLog;
     isClosed:boolean;
     requestId:string;
     loanStatus:LoanStatus;
     maturityDate:Date;
     nextPayment:Date;

}