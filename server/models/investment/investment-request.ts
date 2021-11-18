import { EarningRequestStatus } from "@enums/investmentrequeststatus";
import { EarningType } from "@models/helpers/enums/earningtype";
import { Account } from "../account";
import { BaseEntity } from "../base-entity";
import { Customer } from "../customer";

export class EarningRequest extends BaseEntity {
    customer: Customer;
    customerID:number;
    duration: number;
    amount: number;
    account: Account;
    accountID:number;
    requestDate: Date;
    dateApproved: Date;
    dateProcessed: Date;
    dateDeclined: Date;
    failureReason: string;
    rate: any;
    type: EarningType;
    requestStatus: EarningRequestStatus;
    dateDueForFunding: Date;
    workflow: any;
    requestId: string;

}