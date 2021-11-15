

import { BaseEntity } from "../base-entity";
import { InterestRate } from "./interest-rate";
import { LoanType } from "./loan-type";

export class LoanProduct extends BaseEntity{
    name:string;
     code:string;
     min:number;
     max:number;
     tenure:number;
     tenureDenominator:string;
    loanType:LoanType;
    applyingAs:any;
    interestRate:InterestRate;

}