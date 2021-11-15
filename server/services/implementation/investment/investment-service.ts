import AppConfig from "@api/config";
import { InvestmentRequest } from "@models/investment/investment-request";
import { InvestmentRequestLog } from "@models/investment/investment-request-log";
import { IInvestmentRequestLogService } from "@services/interfaces/investment/Iinvestment-log-request-service";
import { IInvestmentRequestService } from "@services/interfaces/investment/Iinvestment-request-service";
import { IInvestmentService } from "@services/interfaces/investment/Iinvestmentservice";
import EmailService from "../common/email-service";
import { TemplateService } from "../common/template-service";
import UtilService from "../common/util";
export class InvestmentService implements IInvestmentService{
  constructor(private _appConfig:AppConfig,private _templateService:TemplateService, private _emailService:EmailService, private _utils:UtilService){

  }
 getAllInvestmentRequests: () => Promise<InvestmentRequest[]>;
 getAllInvestmentRequestLogs: () => Promise<InvestmentRequestLog[]>;
 getInvestmentRequestById: () => Promise<InvestmentRequest>;
 getInvestmentRequestLogById: () => Promise<InvestmentRequestLog>;
 updateInvestmentRequest:(investmentRequest: InvestmentRequest) =>  Promise<InvestmentRequest>;
 

  restructure: (disbursedInvestmentId: number, repayment: number) => Promise<boolean>;

  process= ({name,emailAddress,payout,duration,rate,maturity,amount}: any) =>  new Promise<any>(async (resolve,reject)=>{
    try{
      const intro = (!name)?"Dear Customer":`Dear ${this._utils.titleCase(name)}`;
      const customerTemplate= `${intro} ,<br/><br/>
  ${this._templateService.INVESTMENT_CUSTOMER_TEMPLATE}
      `;
      const template = `Customer Name: ${name} <br/><br/>
                        Customer Email: ${emailAddress} <br/><br/>
                        Amount: ${this._utils.currencyFormatter(this._utils.convertToPlainNumber(amount))} <br/><br/>
                        Duration: ${duration} Months <br/><br/>
                        Maturity Date: ${maturity} <br/><br/>
                        Total Payout: ${this._utils.currencyFormatter(payout)} <br/><br/>
                        Rate: ${rate}% <br/><br/>`; //`dist/vanaheim/assets/static/Vanir Capital Privacy Policy.pdf`,
 await this._emailService.SendEmail({type:'investment',to:emailAddress,attachment:null,filePaths:[`dist/vanaheim/assets/static/VANIR CAPITAL GLOBAL PITCH DECK_Vol 4.pdf`],html:customerTemplate,toCustomer:true})
 
   await this._emailService.SendEmail({type:'investment',to:this._appConfig.INVESTMENT_EMAIL,attachment:null,filePaths:null,html:template,toCustomer:false})
    
      resolve({status:true,data:{message:"Thanks for indicating your interest in investing 😊"}});

  }
  catch(err){
   console.log(err);
    reject({status:false,data:"Sorry we can not process your request at the moment. Kindly contact our support team."});
  }
 })

  

}