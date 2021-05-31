import { BaseEntity } from "@models/base-entity";
import { Collateral } from "@models/collateral";
import { Company } from "@models/company";
import { Customer } from "@models/customer";
import { Employment } from "@models/employment";
import { NOK } from "@models/nok";
import { Shareholder } from "@models/shareholder";
import { LoanType } from "./loan-type";

export class LoanTypeRequirements extends BaseEntity{
    
    loanType:string;
    loanTypeID:number;
    employment:Employment;
    employmentID:number;
    company:Company;
    companyID:number;
     shareholders:Shareholder[];
     shareholderIDs:string;
    collateral:Collateral;
    collateralID:number;
     loanRequestLogID:number
     nok:NOK; //For Template generation

}