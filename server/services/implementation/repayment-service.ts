// const {SendEmail} = require("./common/email-service");
// const {ProcessPDF} = require("./loan/loan-service");
// const { ADMIN_EMAIL } = require('@config');
// const mailHeader="";
// const ProcessRepayment=(email:string,payload:any)=>new Promise((resolve,reject)=>{
//     let response = createResponse();
//     try{
      
//       let interest=(payload["Interest Rate"]*100).toFixed(2) ;
//       let period=payload["Tenure"].split(' ')[2].replace('s','');
//       // console.log(payload["Tenure"].split(' ')[2]);console
//       let customerTemplate = `<div style="margin-top:50px;"><p>Dear Customer,<br/><br/> 
//   Thank you for your interest in Vanir Capital Limited’s loan service.  <br/><br/> 
//   Further to your enquiry on a loan, please find attached, the applicable
//   repayment plan for your information.  <br/><br/> 
//   Please be informed that our loan interest repayments are calculated on a reducing balance basis making it cheaper with each repayment.<br/><br/> 
//   We thank you for your interest and look forward to a mutually beneficial
//   business relationship with you. <br/><br/> 
//   PS: for further clarifications please contact us on this number: +234
//   818 027 9270
//      </p> </div>
      
//       `;
//       const fileName =`Repayment Plan - ${Date.now()}`;
//       console.log(payload)
//       ProcessPDF(payload,fileName.trim(),"repayment").then((template:any)=>{
//         console.log("Done Generating My Repayment Plan", fileName.trim() )
//   customerTemplate+=template;
//   customerTemplate+="<p>Thank you and best regards.<br><br><b>Vanir Capital Loans and Capital Finance Team</b></p>";
//   customerTemplate = customerTemplate.replace(`<img src="${mailHeader}" style="object-fit:cover;width:80%; margin:auto; margin-left:10%;margin-bottom:50px"/>`,'');
//   // console.log(customerTemplate);
//   template+=`<table style="width:100% !important; background:#e0e0e0; color:#333333;"><thead><th>Potential Customers Email</th><th>${email}</th></thead></table>`;
//   SendEmail({type:'repayment',to:ADMIN_EMAIL,attachment:fileName,fileNames:null,html:template,toCustomer:false})
//   .then(()=>{
//     SendEmail({type:'repayment',to:email,attachment:fileName,fileNames:null,html:customerTemplate,toCustomer:true})
//     .then(()=>{
//       response.isSuccessful=true;
//       response.ResponseCode ="00";
//       response.ResponseDescription="Your repayment plan was submitted successfully";
//       resolve(response);
//     }).catch((err:any)=>{
//       console.log(err);
//       reject(response);
//     });
//   }).catch((err:any)=>{
//     console.log(err);
//     reject(response);
//   });
//       }).catch((err:any)=>{
//         console.log(err);
//         reject(response);
//       });
    
   
//   }
//   catch(err){
//     response.ResponseCode="06"
//     response.Data = err;
//     response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team.";
//     reject(response);
//   }
//   // reject(response);
//   });

//   const getAll=(requestId:string)=>{
//     return new Promise((resolve, reject) =>{});
//   }
//   module.exports = {
//     ProcessRepayment
//     }


import AppConfig from "@api/config";
import { IRepaymentService } from "@services/interfaces/Irepayment-service";
import moment = require("moment");
import EmailService from "./common/email-service";
import { TemplateService } from "./common/template-service";
import UtilService from "./common/util";

export class RepaymentService implements IRepaymentService{
    constructor(private _templateService: TemplateService, private _emailService:EmailService, private _appConfig:AppConfig, private _utilService:UtilService){

    }
    processRepaymentPlan= ({ email,tenure,denominator,loanType,purpose, rate, loanAmount, monthlyRepayment }: any) =>new Promise<any>(async(resolve, reject) =>{
        
        try{
      
                  const fileName =`Repayment Plan - ${Date.now()}`;
                  let t = this.getRepaymentTemplate({ tenure: tenure+' '+denominator,loanType,purpose, rate, loanAmount, monthlyRepayment });
                  let {path}:any = await this._templateService.generatePDF("Repayment Plan",[],"repayments/"+fileName,t);

                  let sent = await this._emailService.SendEmail({type:'repayment',to:this._appConfig.ADMIN_EMAIL,attachment:path,filePaths:null,html:t,toCustomer:false})
                  await this._emailService.SendEmail({type:'repayment',to:email,attachment:path,filePaths:null,html:this._templateService.LOAN_CUSTOMER_TEMPLATE,toCustomer:true})
                  resolve({status:true,data:{message:"Sent successfully"}})
   
        }catch(err){
            console.log(err)
            resolve({status:false,message:"Failed"})
        }
                 
    });


private getRepaymentTemplate({ tenure,loanType,purpose, rate, loanAmount, monthlyRepayment }: any):string{
    let template="";
          //<img src="cid:unique@kreata.ee" style="object-fit:cover;width:100% !important; margin-bottom:50px"/> 
          //<img src="${mailHeader}" style="object-fit:cover;width:80%; margin:auto; margin-left:10%;margin-bottom:50px"/>
       template+=`<div style="width:100% !important;  text-align:center;"><div style="background: #E6AF2A; margin-bottom:20px; padding-top:20px ;padding-bottom:20px;"> <h2>Your Repayment Plan</h2></div></div>`
        let p = Number(loanAmount.replace(/[^0-9.-]+/g,""));
        let n = tenure;
        let m =monthlyRepayment.toString();
        let i =rate;
        let tp ="Monthly";
        let period="month";
        if(n.toLowerCase().includes("day")){
        //   m =  dataSet["Daily Repayment"];
          period ="day";
          tp="Daily"
        } 
        console.log(n.toLowerCase());
        if(n){ n = parseInt(n.split(' ')[0].trim());}
        template+=`
        <div style="width:100%;">
        <div style="color:#333333;padding-top:10px; padding-bottom:10px; width:100%; justify-content:space-between;">
                      <p style="padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333; justify-content:space-between; color:#E6AF2A;">Purpose</p><p style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${this._utilService.titleCase(purpose)}</p>
                    </div>
                    <div style="color:#333333;padding-top:10px; padding-bottom:10px; width:100%;  justify-content:space-between;">
                      <p style="padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333; color:#E6AF2A;">Type</p><p style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${this._utilService.titleCase(loanType)}</p>
                    </div>  
                    </div>
                    <div style="width:100%;position:relative;">
                    <br/><br/>
                    <h3>Loan Information</h3>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100% !important; margin-bottom:60px;  border:1px solid #e0e0e0; font-size:12px !important;">
                    <tbody style="width:100%">
                    
                    <tr style="color:#333333;padding-top:10px; padding-bottom:10px;">
                      <td style="padding-left:10px;padding-top:10px; border-bottom:1px solid #e0e0e0; padding-bottom:10px;background: #333333; color:#E6AF2A;">Loan Amount <b>(NGN)</b></td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${loanAmount.replace("NGN",'').trim()}</td>
                    </tr> 
                    <tr style="color:#333333">
                      <td style="border-bottom:1px solid #e0e0e0;padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333;color:#E6AF2A;">Chosen Tenure</td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${this._utilService.titleCase(tenure)}</td>
                    </tr>
                    
                    <tr>
                      <td style="padding-left:10px;padding-top:10px; padding-bottom:10px;color: #333333; font-weight:bold;">${this._utilService.titleCase(tp)}  Installment <b>(NGN)</b></td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;color: #333333;background:#e0e0e0;"><b>${this._utilService.currencyFormatter(this._utilService.convertToPlainNumber(m)).replace("NGN",'').trim()}</b></td> 
                    </tr>
                    </tbody>
        </table>
        </div>
        <div style="width:100%; position:relative;">
        <h3>Repayment Schedule</h3>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100% !important; font-size:12px !important; border:1px solid #e0e0e0;">
                    <thead style="width:100%;">
                      <tr style="text-align:center; width:100%; color:#E6AF2A; background:#333333; padding-top:10px; padding-bottom:10px;">
                        <th style="padding-top:10px; padding-bottom:10px;">Payment Date</th>
                        <th style="padding-top:10px; padding-bottom:10px;">Loan Balance <b>(NGN)</b></th>
                        <th style="padding-top:10px; padding-bottom:10px;">Principal Repayment <b>(NGN)</b></th>
                        <th style="padding-top:10px; padding-bottom:10px;">Interest Repayment <b>(NGN)</b></th>
                        <th style="padding-top:10px; padding-bottom:10px;">Loan Repayment <b>(NGN)</b></th>
                      </tr>
                    </thead>
                    <tbody>
                   `;
                   
                   const options:any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                   let today  = moment();
                   m = Number(m.replace(/[^0-9.-]+/g,""));
                   let beginning = p;
                   let monthlyPrincipal = 0;
                   let monthlyInterest=0;//m-(p/n);
                   let payment = monthlyInterest + monthlyPrincipal;
                   let total = m *n;
                   console.log(p)
                   console.log(total)
                   for(var c=0;c<n;c++){
                    if(period==="month"){today.add(1,"month")}else{
                      today.add(1,"day");
                    }
                    monthlyInterest= beginning*i;
                    monthlyPrincipal = m-monthlyInterest;
                    // console.log(today.toLocaleDateString("en-US", options));
                     let lDate=today.toDate().toLocaleDateString("en-US", options);
                    
                     let outstanding = beginning-monthlyPrincipal;
                     if(outstanding<0) outstanding=0;
                     if(beginning<0) beginning=0;
                     template+=`<tr style="padding-top:10px; padding-bottom:10px; width:100%;">
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${lDate}</td>
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utilService.currencyFormatter(beginning).replace("NGN",'').trim()}</td>
                                  
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utilService.currencyFormatter(monthlyPrincipal).replace("NGN",'').trim()}</td>
                                  
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utilService.currencyFormatter(monthlyInterest).replace("NGN",'').trim()}</td>
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utilService.currencyFormatter(m).replace("NGN",'').trim()}</td>
                                </tr>`
                                beginning = beginning - monthlyPrincipal;
                              }
        template+=`<tr style="style="width:100%" background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;"><td style="padding-left:10px;background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;" colspan="4">Total Repayment (Principal + Interest)</td><td style="padding-left:10px;background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;">${this._utilService.currencyFormatter(total).replace("NGN",'').trim()}</td></tr></tbody></table></div>`
      
      return template;
}
}