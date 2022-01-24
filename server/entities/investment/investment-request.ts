import { EarningRequestStatus } from "@enums/investmentrequeststatus";
import { EarningType } from "@enums/earningtype";
import moment = require("moment");
import { Account } from "../account";
import { BaseEntity } from "../base-entity";
import { EarningsEmployment } from "./earnings-employment";
import { MeansOfIdentification } from "./means-of-identification";
import { Customer } from "../customer";

export class EarningRequest extends BaseEntity {
    Customer: Customer;
    customerID:number;
    EarningsEmployment: EarningsEmployment;
    employmentID:number;
    meansOfIdentification:MeansOfIdentification;
    meansOfIdentificationID:number;
    duration: number;
    amount: number;
    taxId:string;
    payout: number;
    topUp: number;
    topUpPayout:number;
    monthlyPayment: number;
    maturityDate:string;
    Account: Account;
    accountID:number;
    requestDate: Date;
    // dateFunded: Date;
    dateProcessed: Date;
    dateDeclined: Date;
    failureReason: string;
    rate: any;
    type: EarningType;
    requestStatus: EarningRequestStatus;
    dateActive: Date;
    workflow: any;
    requestId: string;

    
  autogenerateID(serialNumber:number){
      const now =moment();
    return `VCAP-${serialNumber}-${now.format("MMM").toUpperCase()}${now.format("YYYY")}`
  }

}