import { BaseEntity } from "./base-entity";
import { LoanProduct } from "../entities/loan/loan-product";
import { LoanType } from "../entities/loan/loan-type";


export class DocumentRequirement extends BaseEntity{
    loanType:LoanType;
     loanProduct:LoanProduct;
     applyingAs:any;
     requirements:string[];

}