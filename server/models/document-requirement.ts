import { BaseEntity } from "./base-entity";
import { LoanProduct } from "./loan/loan-product";
import { LoanType } from "./loan/loan-type";


export class DocumentRequirement extends BaseEntity{
    loanType:LoanType;
     loanProduct:LoanProduct;
     applyingAs:any;
     requirements:string[];

}