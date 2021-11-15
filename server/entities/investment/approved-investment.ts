
import { LoanStatus } from "server/enums/loanstatus";
import { BaseEntity } from "server/entities/base-entity";
import { InvestmentRequest } from "./investment-request";
import { InvestmentRequestLog } from "./investment-request-log";

export class ApprovedInvestment extends BaseEntity{
    dateApproved:string;
     investmentRequest:InvestmentRequest;
     investmentLogid:InvestmentRequestLog;
     isClosed:boolean;
     investmentId:string;
     investmentStatus:LoanStatus;
     maturityDate:string;
     nextPayment:Date;

}