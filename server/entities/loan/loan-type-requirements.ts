import { BaseEntity } from "server/entities/base-entity";
import { Collateral } from "server/entities/collateral";
import { Company } from "server/entities/company";
import { Customer } from "server/entities/customer";
import { Employment } from "server/entities/employment";
import { NOK } from "server/entities/nok";
import { Shareholder } from "server/entities/shareholder";
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