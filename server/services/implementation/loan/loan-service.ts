import { LoanRequest } from "@models/loan/loan-request";
import { LoanRequestLog } from "@models/loan/loan-request-log";
import { ILoanRequestService } from "@services/interfaces/loan/Iloan-request-service";
import { ILoanService } from "@services/interfaces/loan/Iloanservice";

const {validateRequest,hasValue,titleCase,currencyFormatter, createResponse}= require("./common/util.ts");
const {SendEmail,ProcessFiles, generatePDF, createPDFJson}= require("../common/email-service");
const {ProcessRepayment} = require("../repayment-service");

  
//  const ProcessPDF =(dataSet,fileName,formType)=> new Promise((resolve, reject) => {
//     try{
//   console.log("---------------PROCESSING PDF---------------");
//   // console.log(dataSet);
//   let template = "";
//   if(formType!=="repayment"){
//   for(let item in dataSet){
//     try{
//     let prefix = dataSet[item].pageTitle;
   
//     if(hasValue(prefix)){
  
//   if(prefix.toLowerCase()!="preview"){
//     prefix = expAutoSan.sanitizeIt(prefix);
//     template+=`<table class="section" style="margin-top:30px; font-size:12px !important; padding-top:20px; width:100% !important;">
//     <thead>              
//     <th class="heading" style=";text-transform: uppercase; width:100%; min-width:100%; padding-top:10px; padding-bottom:10px; background:transparent; text-align:center; color:#E6AF2A;">
//                   <h3>${prefix}</h3>
//                   </th>
//                   </thead> 
//               <tbody class="table" style="width:100% !important;">`;
//     for(let entry in dataSet[item]){
//       let shouldSkip=false;
      
//       if(entry.toLowerCase()!=="pagetitle"){
  
//         let record = dataSet[item];
//         if(entry.includes("2")&&!hasValue(record[entry])) shouldSkip=true;
//                      if(!shouldSkip){
//                        let myRecord = record[entry].toString().replace("C:\\fakepath\\","");
//                        myRecord = expAutoSan.sanitizeIt(myRecord);
//                        entry = expAutoSan.sanitizeIt(entry);
//         template+=`<tr class="item" style="border: 2px solid #E0E0E0;width:100% !important;  color:#6B6B6B; padding:10px 2.5%; margin-top:10px;"><td style="border: 2px solid #E0E0E0; padding-top:10px;padding-bottom:10px; padding-left:20px;"><p style="margin:0;padding:0;font-weight:300; font-size:0.85em;">${entry}</p><p class="value" style="margin:0;padding:0;margin-top:5px;"><b>${titleCase(myRecord)}</b></p></td></tr>`;
//                      }
                     
//       }
//     }
//   }
    
//   template+="</tbody></table>"
//     }
//   }catch(err){
//     console.log(err);
//   }
//   }
//   }else{
//     if(hasValue(dataSet)){
//       template+=`<div style="width:100% !important;  text-align:center;"><div style="background: #E6AF2A; margin-bottom:20px; padding-top:20px ;padding-bottom:20px;"> <h2>Your Repayment Plan</h2></div></div>`
//     let p = Number(dataSet["Loan Amount"].replace(/[^0-9.-]+/g,""));
//     let n = dataSet["Tenure"];
//     let m =dataSet["Monthly Repayment"];
//     let i =dataSet["Interest Rate"];
//     let tp ="Monthly";
//     let period="month";
//     if(n.toLowerCase().includes("day")){
//       m =  dataSet["Daily Repayment"];
//       period ="day";
//       tp="Daily"
//     } 
//     console.log(n.toLowerCase());
//     if(hasValue(n)){ n = parseInt(n.split(' ')[0].trim());}
    
//     template+=`
//     <div style="width:100%;">
//     <div style="color:#333333;padding-top:10px; padding-bottom:10px; width:100%; justify-content:space-between;">
//                   <p style="padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333; justify-content:space-between; color:#E6AF2A;">Purpose</p><p style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${titleCase(dataSet["For"])}</p>
//                 </div>
//                 <div style="color:#333333;padding-top:10px; padding-bottom:10px; width:100%;  justify-content:space-between;">
//                   <p style="padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333; color:#E6AF2A;">Category</p><p style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${titleCase(dataSet["Category"])}</p>
//                 </div>  
//                 </div>
//                 <div style="width:100%;position:relative;">
//                 <br/><br/>
//                 <h3>Loan Information</h3>
//     <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100% !important; margin-bottom:60px;  border:1px solid #e0e0e0; font-size:12px !important;">
//                 <tbody style="width:100%">
                
//                 <tr style="color:#333333;padding-top:10px; padding-bottom:10px;">
//                   <td style="padding-left:10px;padding-top:10px; border-bottom:1px solid #e0e0e0; padding-bottom:10px;background: #333333; color:#E6AF2A;">Loan Amount <b>(NGN)</b></td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${dataSet["Loan Amount"].replace("NGN",'').trim()}</td>
//                 </tr> 
//                 <tr style="color:#333333">
//                   <td style="border-bottom:1px solid #e0e0e0;padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333;color:#E6AF2A;">Chosen Tenure</td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${titleCase(dataSet["Tenure"])}</td>
//                 </tr>
                
//                 <tr>
//                   <td style="padding-left:10px;padding-top:10px; padding-bottom:10px;color: #333333; font-weight:bold;">${titleCase(tp)}  Installment <b>(NGN)</b></td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;color: #333333;background:#e0e0e0;"><b>${m.replace("NGN",'').trim()}</b></td> 
//                 </tr>
//                 </tbody>
//     </table>
//     </div>
//     <div style="width:100%; position:relative;">
//     <h3>Repayment Schedule</h3>
//     <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100% !important; font-size:12px !important; border:1px solid #e0e0e0;">
//                 <thead style="width:100%;">
//                   <tr style="text-align:center; width:100%; color:#E6AF2A; background:#333333; padding-top:10px; padding-bottom:10px;">
//                     <th style="padding-top:10px; padding-bottom:10px;">Payment Date</th>
//                     <th style="padding-top:10px; padding-bottom:10px;">Loan Balance <b>(NGN)</b></th>
//                     <th style="padding-top:10px; padding-bottom:10px;">Principal Repayment <b>(NGN)</b></th>
//                     <th style="padding-top:10px; padding-bottom:10px;">Interest Repayment <b>(NGN)</b></th>
//                     <th style="padding-top:10px; padding-bottom:10px;">Loan Repayment <b>(NGN)</b></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                `;
               
//                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//                let today  = new Date();
//                m = Number(m.replace(/[^0-9.-]+/g,""));
//                let beginning = p;
//                let monthlyPrincipal = 0;
//                let monthlyInterest=0;//m-(p/n);
//                let payment = monthlyInterest + monthlyPrincipal;
//                let total = m *n;
//                for(var c=0;c<n;c++){
//                 if(period==="month"){today.addMonths(1)}else{
//                   today.addDays(1);
//                 }
//                 monthlyInterest= beginning*i;
//                 monthlyPrincipal = m-monthlyInterest;
//                 // console.log(today.toLocaleDateString("en-US", options));
//                  let lDate=today.toLocaleDateString("en-US", options);
                
//                  let outstanding = beginning-monthlyPrincipal;
//                  if(outstanding<0) outstanding=0;
//                  if(beginning<0) beginning=0;
//                  template+=`<tr style="padding-top:10px; padding-bottom:10px; width:100%;">
//                               <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${lDate}</td>
//                               <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${currencyFormatter(beginning).replace("NGN",'').trim()}</td>
                              
//                               <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${currencyFormatter(monthlyPrincipal).replace("NGN",'').trim()}</td>
                              
//                               <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${currencyFormatter(monthlyInterest).replace("NGN",'').trim()}</td>
//                               <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${currencyFormatter(m).replace("NGN",'').trim()}</td>
//                             </tr>`
//                             beginning = beginning - monthlyPrincipal;
//                           }
//     template+=`<tr style="style="width:100%" background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;"><td style="padding-left:10px;background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;" colspan="4">Total Repayment (Principal + Interest)</td><td style="padding-left:10px;background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;">${currencyFormatter(total).replace("NGN",'').trim()}</td></tr></tbody></table></div>`
//   }
//   }
//   let css = 'body {padding:5vh 5%;font-family:sans-serif;} .section{margin-top:70px} .table{width:100% !important; } p{margin:0;padding:0;} .item p:first-child{font-weight:300; font-size:0.85em;} .item .value{margin-top:5px;} .item{border: 2px solid #E0E0E0; color:#6B6B6B; padding:10px 2.5%; margin-top:10px;}  .heading{margin-top:20px;text-transform: uppercase;width:100% !important;  padding-top:30px; padding-bottom:30px; background:#333333;text-align:center;color:#E6AF2A;}';
//   let data = {
//     name: 'World'
//   };
//   fs.writeFile(`./uploads/${fileName.trim()}.pdf`, '', function (err) {
//     if (err){ console.log(err);console.log('Writing Error'); reject(err);}
//     console.log('File is created successfully.');
//     // console.log(template);
//     let layout = `<img src="${mailHeader}" style="object-fit:cover;width:80%; margin:auto; margin-left:10%;margin-bottom:50px"/>`;
//     layout +=template;
//     console.log("Generating PDF");
//     console.log(fileName);
//     generatePDF(data,layout,css,fileName.trim()).then(()=>{
      
//     console.log("Done Generating PDF");
//       resolve(template);
//     })
//       .catch((err)=>{console.log(err); reject(err)});
//     console.log("---------------DONE PROCESSING PDF---------------");
    
//   }); 
//     }catch(err){
//       console.log(err)
//       reject(err);
//     }
//   });

  
// const getMinMax=(category)=>{
//     switch(category.toLowerCase()){
//         case "business loans":
//             return {min:50000,max:10000000,minString:"50K",maxString:"10M",tenure:"monthly"};
//           case "personal loans": 
//           return {min:25000,max:5000000,minString:"25K",maxString:"5M",tenure:"monthly"};
//          default:
//              if(category.toLowerCase().includes("float")){
//             if(category.includes("business") )return {min:100000,max:5000000,minString:"100K",maxString:"5M",tenure:"daily"};
//             return {min:25000,max:5000000,minString:"25K",maxString:"1M",tenure:"daily"};
            
//              }
//              return {min:25000,max:5000000,minString:"25K",maxString:"5M",tenure:"monthly"};
//     }
//   }
//   const getInterestRate=(category,loanAmount)=>{
//   let minMax = getMinMax(category);
//   let interestRate =0.1;
//   let paymentType = "Monthly Repayment"
//   let max =parseInt(minMax["max"]);
//   let min = parseInt(minMax["min"]);
//   if(category.toLowerCase().includes( "float me")){
  
//     paymentType = "Daily Repayment";
//   if(loanAmount>=min && loanAmount<100000){
//               interestRate =0.005;
//           }
//   else if(loanAmount>=100000 && loanAmount<200000){
//               interestRate =0.0045;
//           }
//           else if(loanAmount>=200000 && loanAmount<1000000){
//               interestRate=0.004;
//           }
//           else if(loanAmount>=1000000 && loanAmount<=max){
//               interestRate = 0.0033;
//           }else{
//               // alert("Loan Amount must be between the range specified");
//               interestRate=0;
//           }
//           return {paymentType:paymentType,rate:interestRate};   
//   }
//   if(loanAmount>=min && loanAmount<100000){
//               interestRate =0.1;
//           }
//   else if(loanAmount>=100000 && loanAmount<200000)
//           {
//               interestRate =0.07;
//           }else if(loanAmount>=200000 && loanAmount<1000000){
//               interestRate=0.065;
//           }
//           else if(loanAmount>=1000000 && loanAmount<=max){
//               interestRate = 0.06;
//           }else{
//               interestRate=0;
//           }
  
//   return {paymentType:paymentType,rate:interestRate};    
//   }


//    const ProcessLoanRequest=({body})=>new Promise((resolve,reject)=>{
//     let payload = null;
//     let formType = body.type;
//     let response = createResponse();
//         const dataSet = createPDFJson(validateRequest(body,formType))
//     ProcessPDF(dataSet,body.fileName.trim(),formType).then((template)=>{

//         console.log("Done Processing MY PDF ",body.fileName.trim());
//         let customerTemplate = `<div style="width:100% !important;  margin-top:20px;"><p>Dear Customer,<br/><br/>
//         Thank you for your interest in Vanir Capital Limited's loan service.<br/><br/>
//         We acknowledge receipt of your loan request and the documents provided.<br/><br/>
//         Please be informed that your request is receiving attention and an update will be provided soon.
//         <br/><br/>
//         Thank you for your patronage.<br/><br/>
//         Best regards.<br><br><b>Vanir Capital Loans and Capital Finance Team</b></p><div>`;
      
//         ProcessFiles(body.files,dataSet["BVN Verification"]).then((fileNames)=>{
        
//           SendEmail({type:'form',to:ADMIN_EMAIL,attachment:body.fileName,fileNames:fileNames,html:template,toCustomer:false}).then(()=>{
//           SendEmail({type:'form',to:body.email,attachment:body.fileName.trim(),fileNames:null,html:customerTemplate,toCustomer:true}).then(()=>{
//             console.log("Done");
//             let loanCalculator = dataSet["Loan Calculator"];
//             // console.log(loanCalculator);
//             let data = {"Category":titleCase(loanCalculator["Category"]),"For":titleCase(loanCalculator["Loan Purpose"]),"Loan Amount":currencyFormatter(loanCalculator["Loan Amount"]),"Tenure":titleCase(loanCalculator["Tenure"]+" "+ loanCalculator["Period"])};
//             let interestRate = getInterestRate(data.Category,loanCalculator["Loan Amount"]);
//              data["Interest Rate"] =interestRate.rate;
//              data[`${interestRate.paymentType}`] = currencyFormatter(loanCalculator["Monthly Repayment"]);
             
//              ProcessRepayment(body.email,data).then((resp)=>{
//               response.isSuccessful=true;
//               response.ResponseCode ="00";
//               response.ResponseDescription="Your application was submitted successfully";
//               response.Data = data;
//               resolve(response);
//              }).catch(err=>{
//               response.isSuccessful=true;
//               response.ResponseCode ="00";
//               response.ResponseDescription="Your application was submitted successfully";
//               response.Data = payload;
//               console.log("Error sending repayment",err);
//               resolve(response);
//              })
           
//           });
//         }).catch(err=>{console.log(err); throw new Error(err)});
//         });
      
      
      
//       }).catch((err)=>{
//           response.ResponseCode="06"
//           response.Data = err;
//           response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
//           console.log(err);
//           reject(response);
//       });
//   });

//   module.exports = {
//   ProcessLoanRequest,ProcessPDF
//   }

  
export class LoanService implements ILoanService{
  constructor(private _loanRequestService:ILoanRequestService, private _loanRequestLogService:ILoanRequestService){

  }
 getAllLoanRequests: () => Promise<LoanRequest[]>;
 getAllLoanRequestLogs: () => Promise<LoanRequestLog[]>;
 getLoanRequestById: () => Promise<LoanRequest>;
 getLoanRequestLogById: () => Promise<LoanRequestLog>;
 updateLoanRequest= (loanRequest: LoanRequest) =>  new Promise<LoanRequest>(async (resolve,reject)=>{
     try{
    let request = await this._loanRequestLogService.update(loanRequest);
      resolve(request);
     }catch(err){
         reject(err);
     }
  })
 
 

  restructure: (disbursedLoanId: number, repayment: number) => Promise<boolean>;
  

}