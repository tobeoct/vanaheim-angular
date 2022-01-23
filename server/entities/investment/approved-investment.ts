
import { BaseEntity } from "../base-entity";
import { ApprovedEarningStatus } from "@enums/approvedEarningStatus";
import { EarningType } from "@enums/earningtype";
import { BaseStatus } from "@enums/status";
import moment = require("moment");
import { EarningRequest } from "./investment-request";
import { EarningRequestLog } from "./investment-request-log";

export class ApprovedEarning extends BaseEntity {
   
    isClosed: boolean;
    requestId: string;
    earningStatus: ApprovedEarningStatus;
    maturityDate: string;
    lastPaymentDate: Date;
    lastPayment: number;
    nextPaymentDate: Date;
    nextPayment: number;
    EarningRequestLog: EarningRequestLog;
    earningRequestLogID: number;
    EarningRequest: EarningRequest;
    earningRequestID: number;
    new(earningRequest: EarningRequest, earningRequestLog: EarningRequestLog,start:moment.Moment,maturityDate:moment.Moment) {
        this.createdAt = new Date();
        this.isClosed = false;
        this.earningStatus = ApprovedEarningStatus.AwaitingFirstPayment;
        this.requestId = earningRequest.requestId;
        this.status = BaseStatus.Active;
        this.nextPayment = earningRequest.monthlyPayment;
        this.nextPaymentDate =earningRequest.type == EarningType.EndOfTenor? maturityDate.toDate(): start.set("date",24).toDate();//maturityDate.subtract(earningRequest.duration,"months").set("date",24).add(1,  "month").toDate();
        this.lastPayment =0;
        this.lastPaymentDate =new Date();
        this.earningRequestID = earningRequest.id;
        this.earningRequestLogID = earningRequestLog.id;
    }
}

 
 