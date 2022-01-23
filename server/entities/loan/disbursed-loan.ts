

import { LoanStatus } from "@enums/loanstatus";
import { BaseStatus } from "@enums/status";
import moment = require("moment");
import { LoanRequest } from "./loan-request";
import { LoanRequestLog } from "./loan-request-log";
import { BaseEntity } from "../base-entity";

export class DisbursedLoan extends BaseEntity {
    dateDisbursed: Date;
    loanRequestID: number;
    loanRequestLogID: number;
    LoanRequest: LoanRequest;
    LoanRequestLog: LoanRequestLog;
    isClosed: boolean;
    requestID: string;
    loanStatus: LoanStatus;
    maturityDate: Date;
    nextPayment: number;
    nextRepaymentDate: Date;

    new(loanRequest: LoanRequest, loanRequestLog: LoanRequestLog) {
        this.createdAt = new Date();
        this.isClosed = false;
        this.loanStatus = LoanStatus.AwaitingFirstPayment;
        this.requestID = loanRequest.requestId;
        this.status = BaseStatus.Active;
        this.dateDisbursed = loanRequest.dateApproved;
        this.nextPayment = loanRequest.monthlyPayment;
        this.nextRepaymentDate = moment().add(1, loanRequest.denominator == "Months" ? "month" : "day").toDate();
        this.loanRequestID = loanRequest.id;
        this.loanRequestLogID = loanRequestLog.id;
    }

}