import { BaseEntity } from "../base-entity";
import { Collateral } from "../collateral";
import { Company } from "../company";
import { Employment } from "../employment";
import { NOK } from "../nok";
import { Shareholder } from "../shareholder";


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