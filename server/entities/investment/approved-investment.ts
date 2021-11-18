
import { LoanStatus } from "server/enums/loanstatus";
import { BaseEntity } from "server/entities/base-entity";
import { EarningRequest } from "./investment-request";
import { EarningRequestLog } from "./investment-request-log";

export class ApprovedEarning extends BaseEntity{
    dateApproved:string;
     investmentRequest:EarningRequest;
     investmentLogid:EarningRequestLog;
     isClosed:boolean;
     investmentId:string;
     investmentStatus:LoanStatus;
     maturityDate:string;
     nextPayment:Date;

}