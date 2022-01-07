import { LoanRequestStatus } from "@enums/loanrequeststatus";
import { Account } from "@models/account";
import { BaseEntity } from "@models/base-entity";
import { Customer } from "@models/customer";
import { LoanProduct } from "./loan-product";
import { LoanType } from "./loan-type";
import { LoanTypeRequirements } from "./loan-type-requirements";

export class LoanRequest extends BaseEntity{
    Customer:Customer;
    customerID:number;
     loanProduct:string;
     loanProductID:number;
     tenure:number;
     amount:number;
     monthlyPayment:number;
     totalRepayment:number;
     maturityDate:string;
     rate:number;
     accountNumber:string;
     requestDate:Date;
     denominator:string;
     dateApproved:Date;
     dateProcessed:Date;
     dateDeclined:Date;
     failureReason:string;
    requestStatus:LoanRequestStatus;
    dateDueForDisbursement:Date;
     loanType:string;
     loanTypeID:number;
     loanPurpose:string;
     applyingAs:string;
workflow:any;
    loanTypeRequirements:LoanTypeRequirements;
    loanTypeRequirementID:number;
    requestId:string;

    constructor(){
        super();
        this.generateTemplateData = this.generateData;
     }
  private generateData():any{
   let title ="Loan Details";
  
   let rows = [
    {label:"Loan ID",value:this.requestId},
    {label:"Loan Type",value:this.loanType},
    {label:"Applying As",value:this.applyingAs},
    {label:"Loan Product",value:this.loanProduct},
    {label:"Loan Purpose",value:this.loanPurpose},
    {label:"Amount",value:this.amount},
   {label:"Tenure",value:this.tenure},
   {label:"Total Repayment",value:this.totalRepayment},
   {label:"Monthly Repayment",value:this.monthlyPayment},
   {label:"Expected Close Date",value:this.maturityDate},
  ]
    return {title,rows};
  }
}