import { Injectable } from '@angular/core';
import { Utility } from '../../helpers/utility.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
   loanPurpose:any = {
    business:["Expand my business","Increase my inventory","Recruit and hire new talented employees","Improve my business’s cash flow"," Move my business to a new location","Improve and expand my marketing strategy", "Overcome upaid invoices","Take On a new contract", "Update and upgrade my business equipment","‘Other’: Get a loan for any business reason"],
    //personal:["Fees Payment","Bills Payment","Others"],
    personal:["Bill Payments","Investment opportunity","Business Opportunity","LPO financing","Education Funding","Salary/Cash Advance","Repairs and Maintenance","Emergency Expenses","Bulk Purchase","Others"],
    lpo:["Finance Supply orders","Take on a new Supply Contract","Mobilize for a service contract","Stock Inventory"]
}

  constructor(private _utility:Utility) { }
  getRate=(type:string,loanAmount:number,min:number,max:number)=>{
    let interestRate = 0;
    switch(type){
      case 'float me':
        if(loanAmount>=min && loanAmount<100000){
          interestRate =0.005;
      }
else if(loanAmount>=100000 && loanAmount<200000){
          interestRate =0.0045;
      }
      else if(loanAmount>=200000 && loanAmount<1000000){
          interestRate=0.004;
      }
      else if(loanAmount>=1000000 && loanAmount<=max){
          interestRate = 0.0033;
      }else{
          // alert("Loan Amount must be between the range specified");
          interestRate=0;
      }
      return interestRate;
      default :
      if(loanAmount>=min && loanAmount<100000){
        interestRate =0.1;
    }
else if(loanAmount>=100000 && loanAmount<200000)
    {
        interestRate =0.07;
    }else if(loanAmount>=200000 && loanAmount<1000000){
        interestRate=0.065;
    }
    else if(loanAmount>=1000000 && loanAmount<=max){
        interestRate = 0.06;
    }else{
        interestRate=0;
    }
    return interestRate;
    }
  }
  getLoanPurposes=(loanType:string)=>{
      if(loanType.toLowerCase().includes("lpo")) return this.loanPurpose.lpo;
      if(loanType.toLowerCase().includes("business")) return this.loanPurpose.business; 
      return this.loanPurpose.personal;
  }
  getDenominator=(tenure:number,loanType:string)=>{
    if(loanType.toLowerCase().includes("float")){
      return tenure>1?"Days":"Day";
    }
    return tenure>1?"Mos":"Mo";
  }
  calculateMonthlyRepayment=(loanAmount:any,tenure:any,loanType:any)=>{
      // loanAmount = this._utility.convertToPlainNumber(loanAmount)
      let minMax:any = this.getMinMax(loanType);
      let max = +minMax["max"];
      let min = +minMax["min"];
      let interestRate:number=0;
      switch(loanType.toLowerCase()){
          case "Float Me - Business":
              interestRate = this.getRate("float me",loanAmount,min,max);
              break;
          default: interestRate = this.getRate(loanType,loanAmount,min,max); break;
          // $monthlyHeader.textContent = "Monthly Payment (NGN)";
          
      }
      const P = loanAmount;
      const i = interestRate;
      const n = tenure;
      const monthlyPay =(P*i*((1+i)**n))/(((1+i)**n)-1);
      return monthlyPay;
      // this._utility.currencyFormatter(monthlyPay);
  }
   getMinMax=(loanType:any)=>{
                        switch(loanType.toLowerCase()){
                            case "business loans":
                                return {min:50000,max:10000000,minString:"50K",maxString:"10M",tenure:"monthly"};
                              case "personal loans": 
                              return {min:25000,max:5000000,minString:"25K",maxString:"5M",tenure:"monthly"};
                              case "lpo financing":
                                return {min:50000,max:10000000,minString:"50K",maxString:"10M",tenure:"monthly"};
                                case "float me - business":
                                  return {min:100000,max:5000000,minString:"100K",maxString:"5M",tenure:"daily"};
                                  case "float me - personal":
                                    return  {min:25000,max:1000000,minString:"25K",maxString:"1M",tenure:"daily"};
                             default:
                                 return {min:25000,max:5000000,minString:"25K",maxString:"5M",tenure:"monthly"};
                        }
                    }
      getTotalRepayment=(monthlyRepayment:number,tenure:number)=>{
        return monthlyRepayment * tenure;
      }          
}
