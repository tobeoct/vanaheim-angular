import { EarningRequestStatus } from "server/enums/investmentrequeststatus";
import { Account } from "../account";
import { BaseEntity } from "../base-entity";
import { Customer } from "../customer";

export class EarningRequest extends BaseEntity{
    customer:Customer;
     duration:number;
     amount:number;
     account:Account;
     requestDate:Date;
     dateApproved:Date;
     dateProcessed:Date;
     dateDeclined:Date;
     failureReason:string;
     rate:any;
    requestStatus:EarningRequestStatus;
    dateDueForFunding:Date;
workflow:any;
    requestId:string;

}