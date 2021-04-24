import { InvestmentRequest } from "@models/investment/investment-request";
import { InvestmentRequestLog } from "@models/investment/investment-request-log";
import { IInvestmentRequestLogService } from "@services/interfaces/investment/Iinvestment-log-request-service";
import { IInvestmentRequestService } from "@services/interfaces/investment/Iinvestment-request-service";
import { IInvestmentService } from "@services/interfaces/investment/Iinvestmentservice";


const { INVESTMENT_EMAIL } = require('@config');
const {titleCase,currencyFormatter} = require( "./common/util")
const {SendEmail} = require( "./common/email-service")

 const ProcessInvestment=(email:any,payload:any)=>new Promise((resolve,reject)=>{
   let response = {isSuccessful:false, ResponseCode:"06",ResponseDescription:"Processing",Data:null};
  try{
    console.log(payload)
    const intro = (payload.name===null||payload.name===undefined)?"Dear Customer":`Dear ${titleCase(payload.name)}`;
    const customerTemplate= `${intro} ,<br/><br/>

   Welcome to Vanir Capital Limited.<br/><br/>
We thank you for your interest in our investment service. We are
resolute in our mission for quality financial service delivery, assured by
our core values of passion and sustained through Professionalism,
Integrity, Innovation and business sustainability.<br/><br/>
The documents listed below have been attached for your information to
enable you make the right investment decision:<br/><br/>
- A Copy of our Investors Pitch Deck<br/>
- A Copy of our Privacy Policy Document<br/>
Thank you for choosing Vanir Capital. You will be contacted by a
member of the investment team shortly.<br/><br/>
Kind Regards<br/><br/>
<b>Vanir Capital Investment Team</b>
    `;
    const template = `Customer Name: ${payload.name} <br/><br/>
                      Customer Email: ${email} <br/><br/>
                      Amount: ${currencyFormatter(payload.amount)} <br/><br/>
                      Duration: ${payload.duration} Months <br/><br/>
                      Maturity Date: ${payload.maturity} <br/><br/>
                      Total Payout: ${currencyFormatter(payload.payout)} <br/><br/>
                      Rate: ${payload.rate}% <br/><br/>`;
SendEmail({type:'investment',to:email,attachment:null,fileNames:["static/Vanir Capital Privacy Policy.pdf","static/VANIR CAPITAL GLOBAL PITCH DECK_Vol 4.pdf"],html:customerTemplate,toCustomer:true})
.then(()=>{
  SendEmail({type:'investment',to:INVESTMENT_EMAIL,attachment:null,fileNames:null,html:template,toCustomer:false})
  .then(()=>{
    response.isSuccessful=true;
    response.ResponseCode ="00";
    response.ResponseDescription="Thanks for indicating your interest in investing 😊";
    resolve(response);
  }).catch((err:any)=>{
    console.log(err);
    reject(response);
  });
}).catch((err:any)=>{
  console.log(err);
  reject(response);
});
 
}
catch(err){
  response.ResponseCode="06"
  response.Data = err;
  response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team.";
  reject(response);
}
// reject(response);
});


export class InvestmentService implements IInvestmentService{
  constructor(private _investmentRequestService:IInvestmentRequestService, private _investmentRequestLogService:IInvestmentRequestLogService){

  }
 getAllInvestmentRequests: () => Promise<InvestmentRequest[]>;
 getAllInvestmentRequestLogs: () => Promise<InvestmentRequestLog[]>;
 getInvestmentRequestById: () => Promise<InvestmentRequest>;
 getInvestmentRequestLogById: () => Promise<InvestmentRequestLog>;
 updateInvestmentRequest= (investmentRequest: InvestmentRequest) =>  new Promise<InvestmentRequest>(async (resolve,reject)=>{
     try{
    let request = await this._investmentRequestLogService.update(investmentRequest);
      resolve(request);
     }catch(err){
         reject(err);
     }
  })
 
 

  restructure: (disbursedInvestmentId: number, repayment: number) => Promise<boolean>;
  

}