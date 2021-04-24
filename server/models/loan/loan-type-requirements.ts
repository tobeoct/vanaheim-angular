import { BaseEntity } from "@models/base-entity";
import { Collateral } from "@models/collateral";
import { Company } from "@models/company";
import { Employment } from "@models/employment";
import { Shareholder } from "@models/shareholder";
import { LoanType } from "./loan-type";

export class LoanTypeRequirements extends BaseEntity{
    
    loanType:LoanType;
    employment:Employment;
    company:Company;
     shareholders:Shareholder[];
    collateral:Collateral;
     loanRequestId:string

}