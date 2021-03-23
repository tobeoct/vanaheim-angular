/*
Copyright 2018 Google Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
   http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const http = require('http');
const https = require('https');
const express = require('express');
const serverless = require('serverless-http');
const LZString = require('lz-string');
const compression = require('compression');
const axios = require('axios');
// const router = express.Router()
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
let timeout = require('connect-timeout')
const fs = require('fs');
const multer = require('multer');
const fsExtra = require('fs-extra');
const expAutoSan = require('express-autosanitizer');
const { mkdirsSync } = require('./utils/dir');
const uploadPath = path.join(__dirname, 'uploads');
const uploadTempPath = path.join(uploadPath, 'temp');
var httpsRedirect = require('express-https-redirect');
// var enforce = require('express-sslify');
const upload = multer({ dest: uploadTempPath });
let FileAPI = require('file-api')
, File = FileAPI.File
, FileList = FileAPI.FileList
, FileReader = FileAPI.FileReader,reader = new FileReader();
const pdfGenerator = require('template-pdf-generator');
// you must specify a temp upload dir and a max filesize for the chunks
const tmpDir = './public/assets/files';
const maxFileSize = 10;
const maxChunkSize =10;
const app = express();
const jsonParser = bodyParser.json({limit: '100mb'})
let ADMIN_EMAIL =process.env.LOAN_EMAIL;
let CC_EMAIL =process.env.LOAN_EMAIL;
let INVESTMENT_EMAIL = process.env.INVESTMENT_EMAIL
let SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;
const ipChecks = {};
const accountenquiryChecks ={};
const MAXFILEUPLOADSIZE =2;
const mailHeader ='';
let bvnList={
};
let bankList={};
const retryCount=10;
// This serves static files from the specified directory
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

app.use(compression());
app.use(timeout('120s'));
// app.use(haltOnTimedout);
app.use(expAutoSan.all)
// function haltOnTimedout (req, res, next) {
//   console.log("Timed Out Oh")
//   if (!req.timedout) next()
// }

const MAINPATH = __dirname + "/public/";
// app.use(httpsRedirect(),function(req, res, next) {
//     switch(req.url){
//       case "/loans":
//         res.get("/loans");
//         break;
//         case "/investment":
//           res.get("/investment");
//           break;
//           default:
//             if(req.url.includes("/api")){
//     req.getBody = function (callback) {
//         jsonParser(req, res,function (err) {
//           callback(err, req.body);
//         });
//       }
//     }
//     else if(req.url.includes("/apply")){
//       req.get("/apply");
//     }
    
//     else if (req.url.includes("uploads")){
//       res.status(404);
//       res.send();
//     }
//       break;
//   }
//   // allow the request to continue
//   next();
// });

// app.use(enforce.HTTPS(true));
// app.use(express.static(__dirname + "dist/vanaheim"));
app.use(express.static('./dist/vanaheim'));
app.use(errorHandler);

// app.get('/',async function (req, res) {
// 	res.setHeader('Cache-Control', 'public, max-age=5000');
//   res.sendFile(MAINPATH+'index.html');
// });
// app.get('/loans',async function (req, res) {
// 	// res.setHeader('Cache-Control', 'public, max-age=5000');
// 	res.sendFile(MAINPATH+'loans.html');
// });
// app.get('/apply',async function (req, res) {
// 	// res.setHeader('Cache-Control', 'public, max-age=5000');
// 	res.sendFile(MAINPATH+'apply.html');
// });
// app.get('/investment',async function (req, res) {
//   	// res.setHeader('Cache-Control', 'public, max-age=5000');
// 	res.sendFile(MAINPATH+'investment.html');
// });
const spamChecker=(ip,controller)=>{
  try{
    if(!hasValue(ip)||!hasValue(controller)) return false;
  if(hasValue(ipChecks[controller])){
    let value = ipChecks[controller][ip];
    if(hasValue(value)){
    if(parseInt(value.count)>=retryCount && (value.datetime.getHours())==new Date().getHours()){
      ipChecks[controller][ip].count +=1;
      ipChecks[controller][ip].datetime = new Date();
      return false;
    }else{
      ipChecks[controller][ip].count +=1;
      ipChecks[controller][ip].datetime = new Date();
    }
  }else{
    ipChecks[controller][ip]={count:1,datetime:new Date()};
  }
  }else{
    ipChecks[controller]={};
    ipChecks[controller][ip]={count:1,datetime:new Date()}
  }
  console.log("SPAM CHECKER:" +JSON.stringify(ipChecks));
  return true;
}catch(err){
  console.log("SPAM CHECKER: ERROR -" +err);
} return false;
}
const hasValue=(obj)=>{
  if(obj!==""&&obj!==null && obj!==undefined && obj!=="undefined" && obj!={}) return true;
  return false;
}
const validateRequest=(request,formType)=>{
  let payload = request.payload;
  console.log(payload)
  return JSON.parse(payload);
}
const titleCase=(str)=> {
  try{
  if(hasValue(str)){
  if(str.includes("NGN")) return str;
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}
return str;
  }catch(err){
    console.log(err);
    return str;
  }
}
const myEscape=(value)=>{
  var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
  };
  value = value.replace(/[&<>]/g, function(tag) {
      return tagsToReplace[tag] || tag;
  });
  return value;
}
const createPDFJson=(application)=>{
  // console.log(application);
  if(!hasValue(application)) throw new Error("Invalid Application");
  let docDataSet ={};
  let invalid =0
  let total = Object.keys(application).length;
  for(let item in application){
    const prefix = application[item].pageTitle;
    if(hasValue(application[item])){
      total+=Object.keys(application[item]).length
    for(let entry in application[item]){
      if(hasValue(application[item][entry])){
      if(entry.toLowerCase()!=="pagetitle"){
        let record = application[item];
      
      }
    }else{
      invalid+=1
    }
    }
  }else{
    invalid+=1
  }
  }
  // console.log(docDataSet);
  const correctnessPercentage =((total-invalid)/total)*100;
  console.log(correctnessPercentage);
  if(correctnessPercentage>=80){
  return application;
  }else{
    return null;
  }
}
const verifyRequest=(req,controller)=>{
  if(!hasValue(req.body)) return false;
  if(!hasValue(req.ip)) return false;
  if(controller==="sendapplication"){
    if(!hasValue(req.body.email)) return false;
   
  }
  return true;
}

const getMinMax=(category)=>{
  switch(category.toLowerCase()){
      case "business loans":
          return {min:50000,max:10000000,minString:"50K",maxString:"10M",tenure:"monthly"};
        case "personal loans": 
        return {min:25000,max:5000000,minString:"25K",maxString:"5M",tenure:"monthly"};
       default:
           if(category.toLowerCase().includes("float")){
          if(category.includes("business") )return {min:100000,max:5000000,minString:"100K",maxString:"5M",tenure:"daily"};
          return {min:25000,max:5000000,minString:"25K",maxString:"1M",tenure:"daily"};
          
           }
           return {min:25000,max:5000000,minString:"25K",maxString:"5M",tenure:"monthly"};
  }
}
const getInterestRate=(category,loanAmount)=>{
let minMax = getMinMax(category);
let interestRate =0.1;
let paymentType = "Monthly Repayment"
let max =parseInt(minMax["max"]);
let min = parseInt(minMax["min"]);
if(category.toLowerCase().includes( "float me")){

  paymentType = "Daily Repayment";
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
        return {paymentType:paymentType,rate:interestRate};   
}
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

return {paymentType:paymentType,rate:interestRate};    
}
function errorHandler (err, req, res, next) {
  res.status(500);
  console.log(err);
  // res.render('error', { error: err })
}

const currencyFormatter=(value)=>{
  return Intl.NumberFormat('yo-NG', {style: 'currency', currency: 'NGN'})
.format(value)
}
Date.prototype.addDays=function(days) {
  var result =this.getDate();
  this.setDate(result + days);
  return result;
}

Date.prototype.getDaysInMonth = function () { 
  return new Date(this.getFullYear(), this.getMonth());
};
Date.prototype.addMonths = function (value) {
  var n = this.getDate();
  this.setDate(1);
  this.setMonth(this.getMonth() + value);
  this.setDate(Math.min(n, this.getDaysInMonth()));
  return this;
};
const ProcessPDF =(dataSet,fileName,formType)=> new Promise((resolve, reject) => {
  try{
console.log("---------------PROCESSING PDF---------------");
// console.log(dataSet);
let template = "";
if(formType!=="repayment"){
for(let item in dataSet){
  try{
  let prefix = dataSet[item].pageTitle;
 
  if(hasValue(prefix)){

if(prefix.toLowerCase()!="preview"){
  prefix = expAutoSan.sanitizeIt(prefix);
  template+=`<table class="section" style="margin-top:30px; font-size:12px !important; padding-top:20px; width:100% !important;">
  <thead>              
  <th class="heading" style=";text-transform: uppercase; width:100%; min-width:100%; padding-top:10px; padding-bottom:10px; background:transparent; text-align:center; color:#E6AF2A;">
                <h3>${prefix}</h3>
                </th>
                </thead> 
            <tbody class="table" style="width:100% !important;">`;
  for(let entry in dataSet[item]){
    let shouldSkip=false;
    
    if(entry.toLowerCase()!=="pagetitle"){

      let record = dataSet[item];
      if(entry.includes("2")&&!hasValue(record[entry])) shouldSkip=true;
                   if(!shouldSkip){
                     let myRecord = record[entry].toString().replace("C:\\fakepath\\","");
                     myRecord = expAutoSan.sanitizeIt(myRecord);
                     entry = expAutoSan.sanitizeIt(entry);
      template+=`<tr class="item" style="border: 2px solid #E0E0E0;width:100% !important;  color:#6B6B6B; padding:10px 2.5%; margin-top:10px;"><td style="border: 2px solid #E0E0E0; padding-top:10px;padding-bottom:10px; padding-left:20px;"><p style="margin:0;padding:0;font-weight:300; font-size:0.85em;">${entry}</p><p class="value" style="margin:0;padding:0;margin-top:5px;"><b>${titleCase(myRecord)}</b></p></td></tr>`;
                   }
                   
    }
  }
}
  
template+="</tbody></table>"
  }
}catch(err){
  console.log(err);
}
}
}else{
  if(hasValue(dataSet)){
    template+=`<div style="width:100% !important;  text-align:center;"><div style="background: #E6AF2A; margin-bottom:20px; padding-top:20px ;padding-bottom:20px;"> <h2>Your Repayment Plan</h2></div></div>`
  let p = Number(dataSet["Loan Amount"].replace(/[^0-9.-]+/g,""));
  let n = dataSet["Tenure"];
  let m =dataSet["Monthly Repayment"];
  let i =dataSet["Interest Rate"];
  let tp ="Monthly";
  let period="month";
  if(n.toLowerCase().includes("day")){
    m =  dataSet["Daily Repayment"];
    period ="day";
    tp="Daily"
  } 
  console.log(n.toLowerCase());
  if(hasValue(n)){ n = parseInt(n.split(' ')[0].trim());}
  
  template+=`
  <div style="width:100%;">
  <div style="color:#333333;padding-top:10px; padding-bottom:10px; width:100%; justify-content:space-between;">
                <p style="padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333; justify-content:space-between; color:#E6AF2A;">Purpose</p><p style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${titleCase(dataSet["For"])}</p>
              </div>
              <div style="color:#333333;padding-top:10px; padding-bottom:10px; width:100%;  justify-content:space-between;">
                <p style="padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333; color:#E6AF2A;">Category</p><p style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${titleCase(dataSet["Category"])}</p>
              </div>  
              </div>
              <div style="width:100%;position:relative;">
              <br/><br/>
              <h3>Loan Information</h3>
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100% !important; margin-bottom:60px;  border:1px solid #e0e0e0; font-size:12px !important;">
              <tbody style="width:100%">
              
              <tr style="color:#333333;padding-top:10px; padding-bottom:10px;">
                <td style="padding-left:10px;padding-top:10px; border-bottom:1px solid #e0e0e0; padding-bottom:10px;background: #333333; color:#E6AF2A;">Loan Amount <b>(NGN)</b></td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${dataSet["Loan Amount"].replace("NGN",'').trim()}</td>
              </tr> 
              <tr style="color:#333333">
                <td style="border-bottom:1px solid #e0e0e0;padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333;color:#E6AF2A;">Chosen Tenure</td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${titleCase(dataSet["Tenure"])}</td>
              </tr>
              
              <tr>
                <td style="padding-left:10px;padding-top:10px; padding-bottom:10px;color: #333333; font-weight:bold;">${titleCase(tp)}  Installment <b>(NGN)</b></td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;color: #333333;background:#e0e0e0;"><b>${m.replace("NGN",'').trim()}</b></td> 
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
             
             const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
             let today  = new Date();
             m = Number(m.replace(/[^0-9.-]+/g,""));
             let beginning = p;
             let monthlyPrincipal = 0;
             let monthlyInterest=0;//m-(p/n);
             let payment = monthlyInterest + monthlyPrincipal;
             let total = m *n;
             for(var c=0;c<n;c++){
              if(period==="month"){today.addMonths(1)}else{
                today.addDays(1);
              }
              monthlyInterest= beginning*i;
              monthlyPrincipal = m-monthlyInterest;
              // console.log(today.toLocaleDateString("en-US", options));
               let lDate=today.toLocaleDateString("en-US", options);
              
               let outstanding = beginning-monthlyPrincipal;
               if(outstanding<0) outstanding=0;
               if(beginning<0) beginning=0;
               template+=`<tr style="padding-top:10px; padding-bottom:10px; width:100%;">
                            <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${lDate}</td>
                            <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${currencyFormatter(beginning).replace("NGN",'').trim()}</td>
                            
                            <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${currencyFormatter(monthlyPrincipal).replace("NGN",'').trim()}</td>
                            
                            <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${currencyFormatter(monthlyInterest).replace("NGN",'').trim()}</td>
                            <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${currencyFormatter(m).replace("NGN",'').trim()}</td>
                          </tr>`
                          beginning = beginning - monthlyPrincipal;
                        }
  template+=`<tr style="style="width:100%" background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;"><td style="padding-left:10px;background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;" colspan="4">Total Repayment (Principal + Interest)</td><td style="padding-left:10px;background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;">${currencyFormatter(total).replace("NGN",'').trim()}</td></tr></tbody></table></div>`
}
}
let css = 'body {padding:5vh 5%;font-family:sans-serif;} .section{margin-top:70px} .table{width:100% !important; } p{margin:0;padding:0;} .item p:first-child{font-weight:300; font-size:0.85em;} .item .value{margin-top:5px;} .item{border: 2px solid #E0E0E0; color:#6B6B6B; padding:10px 2.5%; margin-top:10px;}  .heading{margin-top:20px;text-transform: uppercase;width:100% !important;  padding-top:30px; padding-bottom:30px; background:#333333;text-align:center;color:#E6AF2A;}';
let data = {
  name: 'World'
};
fs.writeFile(`./uploads/${fileName.trim()}.pdf`, '', function (err) {
  if (err){ console.log(err);console.log('Writing Error'); reject(err);}
  console.log('File is created successfully.');
  // console.log(template);
  let layout = `<img src="${mailHeader}" style="object-fit:cover;width:80%; margin:auto; margin-left:10%;margin-bottom:50px"/>`;
  layout +=template;
  console.log("Generating PDF");
  console.log(fileName);
  generatePDF(data,layout,css,fileName.trim()).then(()=>{
    
  console.log("Done Generating PDF");
    resolve(template);
  })
    .catch((err)=>{console.log(err); reject(err)});
  console.log("---------------DONE PROCESSING PDF---------------");
  
}); 
  }catch(err){
    console.log(err)
    reject(err);
  }
});
async function GetFileInBase64(file) {
  let response ;
  const result = await toBase64(file).then((f)=>response=f).catch(e => Error(e));
  if(result instanceof Error) {
     console.log('Error: ', result.message);
     return null;
  }
  return response;
  //...
}
const toBase64 = file => new Promise((resolve, reject) => {
 try{
  // const reader = new FileReader();
  reader.readAsDataURL(new File(file));
  reader.onload = () =>{
    
    resolve(reader.result);
    // }
  }
  reader.onerror = (error) => {
    console.log(error);
    toBase64(file).then((f)=>resolve(f)).catch(err=>reject(err));
    // reject(error);
  }
}catch(error){
  console.log(error);
    toBase64(file).then((f)=>resolve(f)).catch(err=>reject(err));
    
}
});
const createReadStream=(file,bitmap)=>new Promise((resolve,reject)=>{
  fs.createReadStream(`${file}`, { encoding: 'base64' }).on('data', function (data) {
    // console.log('got data', data);
    bitmap+=data;
  }).on('end', function () {
      console.log('No more data');
      if(hasValue(bitmap)){
      resolve(bitmap);
      }else{
         createReadStream(file,bitmap).then(map=>{
           bitmap=map;
           if(hasValue(bitmap)) resolve(bitmap);
        });
      }
    });
});
const generatePDF=(data,template,css,fileName)=>new Promise((resolve,reject)=>{
  try{
  resolve(pdfGenerator(data, template, css).pipe(fs.createWriteStream(`./uploads/${fileName}.pdf`)));
  }catch(err){
    reject(err);
  }
});
async function SendEmail({subject,to,attachment,fileNames,html,toCustomer,type}){
  return new Promise((resolve,reject)=>{
//const SendEmail=({subject,to,attachment,fileNames,html,toCustomer,type})=>new Promise((resolve,reject)=>{
  console.log("---------------SENDING EMAIL---------------");
  let transporterOptions = {
    // service: 'gmail',
    host: process.env.HOST,
    port: 465,
    secure: process.env.ISSECURE, // use SSL
   
    auth: {
      user: process.env.LOAN_EMAIL,
      pass:process.env.LOAN_EMAIL_PASS
    }
  };

  if(process.env.SERVICE) transporterOptions["service"] ="gmail";
  ADMIN_EMAIL = process.env.LOAN_EMAIL;
  CC_EMAIL = process.env.LOAN_EMAIL;
  try{
  switch(type){
    case "form":
      subject = toCustomer?'Vanir Capital: Your Loan Application Is Completed':'JUST IN! New Application';
      break;
    case "feedback":
      subject = toCustomer?'Vanir Capital: Thanks For The Feedback':'A Customer Gave A Feedback';
      transporterOptions.auth = {
          user: process.env.SUPPORT_EMAIL,
          pass:process.env.SUPPORT_EMAIL_PASS
        };
      
      ADMIN_EMAIL = process.env.SUPPORT_EMAIL;
      CC_EMAIL = process.env.SUPPORT_EMAIL;
      break;
    case "repayment":
      subject = toCustomer?'Vanir Capital: Your Repayment Plan':'A Customer Requested For A Repayment Plan';
      break;
      case "investment":
      subject = toCustomer?'Vanir Capital: Investment Indication':'Investment Indication';
      transporterOptions.auth = {
          user: process.env.INVESTMENT_EMAIL,
          pass:process.env.INVESTMENT_EMAIL_PASS
        };
      
      ADMIN_EMAIL = process.env.INVESTMENT_EMAIL;
      CC_EMAIL = process.env.INVESTMENT_EMAIL;
      break;
  }
 const transporter = nodemailer.createTransport(transporterOptions);
  // <img src="cid:myLogo" style=" width:100px;  margin-bottom:10px"/>

  console.log(transporterOptions)
  let mailOptions = {
    from:ADMIN_EMAIL,
    to: to.trim(),
    subject:subject,
    html :`<div style="padding-top:5vh;padding-bottom:0px; font-family:'Roboto','Arial','Helvetica',sans-serif'; width:100% !important;"><div style="width:100% !important;  height:auto; text-align:center; min-width:500px; margin-bottom:0px;">
    
      <h1 style="margin-top:10px;"><b>Vanir Capital</b></h1>
    </div>`,
    attachments:[
     
    ]
  };
  if(hasValue(attachment)){
    console.log(`./uploads/${attachment.trim()}.pdf`)
    mailOptions["attachments"].push({   // file on disk as an attachment 
    filename: `${attachment.split('-')[0].replace("static/",'').trim()}.pdf` ,
    path: `./uploads/${attachment.trim()}.pdf` // stream this file
  });
    }
    if(hasValue(fileNames)){
      
      if(!hasValue(mailOptions["attachments"]))mailOptions["attachments"]=[]
      console.log("File Names");
      console.log(fileNames);
    for(let i=0;i<fileNames.length;i++){
      mailOptions["attachments"].push({   // file on disk as an attachment
        filename: `${fileNames[i].replace("static/",'').trim()}` ,
        path: `./uploads/${fileNames[i]}` // stream this file
      });
    }
    }
  if(!toCustomer){
    mailOptions['cc']= CC_EMAIL;//"tobe.onyema@gmail.com";
    if(!hasValue(html)){
    mailOptions["html"]+=`<b>You just got a new application</b> <br/> <b>Name:</b> ${attachment.split('-')[0]} <br/> <b>Phone Number:</b> ${attachment.split('-')[1]}`;
    }else{
      mailOptions["html"]+=html;
    }
   
  }
  else{
   // mailOptions['cc']= CC_EMAIL;
    if(!hasValue(html)){
      mailOptions["html"]+=`Hello, <br/> <h1>Thanks for choosing Vanir Capital</h1> <br/><br/> We would get in touch with you shortly <br/><br/> <p class="theme_color--grey">If you are looking to invest? <span class="theme_color--yellow"><a href="http://vanircapital.org/investment.html" target="_blank"><u>Click here</u></a></span></p>
    `;}
    else{
      mailOptions["html"]+=html;
    }
  }
  // <div style="display:inline-block;max-width:100px; background:#333333; width:20%; margin-top:20px; padding:12.5px; margin-right:20px;"><img src="cid:myLogo" style="width:90%; "/></div>
  mailOptions["html"]+=`
 
</div>
<div style="width:100%; margin-top:0px;font-size:0.8em !important; margin-bottom:200px;">
<div style="width:100%; height:100%;">
    <div style="display:inline-block;vertical-align:top; padding:10px;"><h3>Contact Us:</h3><p>+234 818 598 4292</p> <p> +234 818 027 9270</p></p><p style="">support@vanircapital.org</p><p style="">www.vanircapital.org</p></div>
    <div style="display:inline-block;vertical-align:top;  padding:10px;">
<h3>Follow Us On:</h3>
<p><b><a href="https://web.facebook.com/VanirCapital/?_rdc=1&_rdr">Facebook</a></b></p>
<p><b><a href="https://twitter.com/VanirCapital">Twitter</a></b></p>
<p><b><a href="https://www.linkedin.com/company/vanircapitalllc">LinkedIn</a></b></p>
<p><b><a href="https://www.instagram.com/vanircapital/?igshid=16udnitg8jich">Instagram</a></b></p>
    </div>
    </div>


</div>`;
console.log("Attachments")
console.log(mailOptions["attachments"])
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      reject(error);
    } else {
      resolve("Email sent");
      console.log('Email sent: ' + info.response);
      console.log(`${to.trim()} ${attachment} ${new Date()}`);
    }
    console.log("---------------DONE SENDING EMAIL---------------");
  });
  }
  catch(err){
    console.log(err);
    throw new Error(err);
  }
});
}
const base64MimeType=(encoded) =>{
  let result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  let mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
}
const ProcessFiles=(files,bvnVer) => new Promise((resolve, reject) => {
 // console.log(files)
  let fileNames = [];
  let bvnFile;
  if(hasValue(files)){
    for(let item in files){
      fileNames.push(files[item]);
    }
    //Send bvn information to VCAP
    let shouldProceed = false;
    if(hasValue(bvnVer)){
      if(hasValue(bvnVer["BVN"])){
        if(hasValue(bvnList[bvnVer["BVN"]])){
        if(hasValue(bvnList[bvnVer["BVN"]]["basicDetails"])){
          shouldProceed = true;
        }}}}
          if(shouldProceed){
      //console.log(bvnVer["BVN"]);
      let item ="BVN Details To VCAP.jpg";
    files["BVN Details To VCAP.jpg"] =  LZString.compress( `data:image/jpg;base64,${bvnList[bvnVer["BVN"]]["basicDetails"]}`);
    let base64String = LZString.decompress(files[item]); // Not a real image
    let mime = base64MimeType(base64String);
    // console.log(item);
    // console.log(mime);
    if(hasValue(mime)){
      mime = mime.split('/')[1];
// Remove header
let itemName=`${item.split('.')[0]}-${Date.now()}.${mime}`;
    fileNames.push(itemName);
let base64Image = base64String.split(';base64,').pop();
fs.writeFile(`./uploads/${itemName}`, base64Image, {encoding: 'base64'}, function(err) {
  console.log('File created');
  resolve(fileNames);
});
    }
    } else{
      resolve(fileNames);
    }
    // console.log(Object.keys(files));
   
     
    
  
  }else{
    reject("Invalid Files");
  }

});
const validateResponse=(response)=> {
  if (response.status!==200) {
    throw Error(response.statusText);
  }
  return response;
}

const readResponseAsJSON=(response)=> {
  return response.data;
}//https://cors-anywhere.herokuapp.com/

const ProcessRepayment=(email,payload)=>new Promise((resolve,reject)=>{
  let response = {isSuccessful:false, ResponseCode:"06",ResponseDescription:"Processing",Data:null};
  try{
    
    let interest=(payload["Interest Rate"]*100).toFixed(2) ;
    let period=payload["Tenure"].split(' ')[2].replace('s','');
    // console.log(payload["Tenure"].split(' ')[2]);console
    let customerTemplate = `<div style="margin-top:50px;"><p>Dear Customer,<br/><br/> 
Thank you for your interest in Vanir Capital Limited’s loan service.  <br/><br/> 
Further to your enquiry on a loan, please find attached, the applicable
repayment plan for your information.  <br/><br/> 
Please be informed that our loan interest repayments are calculated on a reducing balance basis making it cheaper with each repayment.<br/><br/> 
We thank you for your interest and look forward to a mutually beneficial
business relationship with you. <br/><br/> 
PS: for further clarifications please contact us on this number: +234
818 027 9270
   </p> </div>
    
    `;
    const fileName =`Repayment Plan - ${Date.now()}`;
    console.log(payload)
    ProcessPDF(payload,fileName.trim(),"repayment").then((template)=>{
      console.log("Done Generating My Repayment Plan", fileName.trim() )
customerTemplate+=template;
customerTemplate+="<p>Thank you and best regards.<br><br><b>Vanir Capital Loans and Capital Finance Team</b></p>";
customerTemplate = customerTemplate.replace(`<img src="${mailHeader}" style="object-fit:cover;width:80%; margin:auto; margin-left:10%;margin-bottom:50px"/>`,'');
// console.log(customerTemplate);
template+=`<table style="width:100% !important; background:#e0e0e0; color:#333333;"><thead><th>Potential Customers Email</th><th>${email}</th></thead></table>`;
SendEmail({type:'repayment',to:ADMIN_EMAIL,attachment:fileName,fileNames:null,html:template,toCustomer:false})
.then(()=>{
  SendEmail({type:'repayment',to:email,attachment:fileName,fileNames:null,html:customerTemplate,toCustomer:true})
  .then(()=>{
    response.isSuccessful=true;
    response.ResponseCode ="00";
    response.ResponseDescription="Your repayment plan was submitted successfully";
    resolve(response);
  }).catch(err=>{
    console.log(err);
    reject(response);
  });
}).catch(err=>{
  console.log(err);
  reject(response);
});
    }).catch(err=>{
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

const ProcessInvestment=(email,payload)=>new Promise((resolve,reject)=>{
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
  }).catch(err=>{
    console.log(err);
    reject(response);
  });
}).catch(err=>{
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
const instance = axios.create({
  method: 'post',
  baseURL: 'https://app.verified.ng',
  timeout: 20000,
  headers: {'Content-Type': 'application/json','apiKey': "zeb'V8U*-h*e-jO'",'userid':'1543318849803','mode': 'no-cors'},
});

const server = app.listen(process.env.PORT || 8081, () => {

  const host = server.address().address;
  const port = server.address().port;


  // var networkInterfaces = os.networkInterfaces( );

  // console.log( networkInterfaces );
  console.log('App listening at http://%s:%s', host, port);
});

app.get('*', function(req, res) {
  res.sendFile('dist/vanaheim/index.html',{ root: __dirname })
})
app.post('/api/sendapplication',[jsonParser, expAutoSan.route,timeout('500s')], async (req, res) => {
  console.log("---------------SEND APPLICATION---------------");
  let response = {isSuccessful:false, ResponseCode:"06",ResponseDescription:"Processing",Data:null};
 
  if(verifyRequest(req,"sendapplication")&&spamChecker(req.ip,"sendapplication")){
    console.log("---------------REQUEST VALIDATED---------------");
    let payload = null;
    try{
      if(hasValue(req.body&&hasValue(req.body.fileName))){
        let formType = req.body.type;
        const dataSet = createPDFJson(validateRequest(req.body,formType))
        ProcessPDF(dataSet,req.body.fileName.trim(),formType).then((template)=>{

          console.log("Done Processing MY PDF ",req.body.fileName.trim());
          let customerTemplate = `<div style="width:100% !important;  margin-top:20px;"><p>Dear Customer,<br/><br/>
          Thank you for your interest in Vanir Capital Limited's loan service.<br/><br/>
          We acknowledge receipt of your loan request and the documents provided.<br/><br/>
          Please be informed that your request is receiving attention and an update will be provided soon.
          <br/><br/>
          Thank you for your patronage.<br/><br/>
          Best regards.<br><br><b>Vanir Capital Loans and Capital Finance Team</b></p><div>`;
        
          ProcessFiles(req.body.files,dataSet["BVN Verification"]).then((fileNames)=>{
          
            SendEmail({type:'form',to:ADMIN_EMAIL,attachment:req.body.fileName,fileNames:fileNames,html:template,toCustomer:false}).then(()=>{
            SendEmail({type:'form',to:req.body.email,attachment:req.body.fileName.trim(),fileNames:null,html:customerTemplate,toCustomer:true}).then(()=>{
              console.log("Done");
              let loanCalculator = dataSet["Loan Calculator"];
              // console.log(loanCalculator);
              let data = {"Category":titleCase(loanCalculator["Category"]),"For":titleCase(loanCalculator["Loan Purpose"]),"Loan Amount":currencyFormatter(loanCalculator["Loan Amount"]),"Tenure":titleCase(loanCalculator["Tenure"]+" "+ loanCalculator["Period"])};
              let interestRate = getInterestRate(data.Category,loanCalculator["Loan Amount"]);
               data["Interest Rate"] =interestRate.rate;
               data[`${interestRate.paymentType}`] = currencyFormatter(loanCalculator["Monthly Repayment"]);
               
               ProcessRepayment(req.body.email,data).then((resp)=>{
                response.isSuccessful=true;
                response.ResponseCode ="00";
                response.ResponseDescription="Your application was submitted successfully";
                response.Data = data;
                res.send(response);
               }).catch(err=>{
                response.isSuccessful=true;
                response.ResponseCode ="00";
                response.ResponseDescription="Your application was submitted successfully";
                response.Data = payload;
                console.log(err);
                res.send(response);
               })
             
            });
          }).catch(err=>{console.log(err); throw new Error(err)});
          });
        }).catch((err)=>{
            response.ResponseCode="06"
            response.Data = err;
            response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
            console.log(err);
            res.send(response);
        });
     
      }
    }
    catch(err){
      response.ResponseCode="06"
      response.Data = err;
      response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
      console.log(err);
      res.send(response);
    }
  }else{
    response.ResponseCode="06";
    response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
    console.log(`Spam Suspected ${req.ip} ${JSON.stringify(ipChecks[req.ip])} ${new Date()}`);
    res.send(response);
  }
  console.log("---------------SEND APPLICATION DONE---------------");
  // res.send(response);
})

app.post('/api/validatebvn',[jsonParser, expAutoSan.route],async (req, res) => {
  let response = {isSuccessful:false, ResponseCode:"06",ResponseDescription:"Processing",Data:null};
  if(verifyRequest(req,"validatebvn")&&spamChecker(req.ip,"validatebvn")){
    try{
   let url='/bvn-service/api/svalidate/wrapper';
  let body ={email:req.body.email,bvn:req.body.payload};
  if(!hasValue(bvnList[body.bvn])){
    instance.post(url,body).then(validateResponse).then((response)=>readResponseAsJSON(response))
    .then((result)=>{
      if(hasValue(result["code"])){
     bvnList[body.bvn] = result;
      }
      response.isSuccessful=true;
    response.ResponseCode ="00";
    response.ResponseDescription="Your request was successful";
    response.Data= result;
    
  res.send(response);
    }).catch((err)=>{console.log(err);throw new Error(err);});
  }else{
    console.log("Cached Result");
    response.isSuccessful=true;
    response.ResponseCode ="00";
    response.ResponseDescription="Your request was successful";
    response.Data = bvnList[body.bvn];
    res.send(response);
  }
  }
  catch(err){
    response.ResponseCode="06"
    response.Data = err;
    response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
    console.log(err);
    res.send(response);
  }
  }else{
    response.ResponseCode="06"
    response.Data = "Spam Alert";
    response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
    res.send(response);
  }
});
app.post('/api/accountenquiry',[jsonParser, expAutoSan.route],async (req, res) => {
  let response = {isSuccessful:false, ResponseCode:"06",ResponseDescription:"Processing",Data:null};
  let accountNumber;
  if(verifyRequest(req,"accountenquiry")&&spamChecker(req.ip,"accountenquiry")){
    try{
   let url='/inquiry/api/sacctinq/bvn/wrapper';
  let body ={bankCode:req.body.bankcode,accountNumber:req.body.accountnumber};
  accountNumber = body.accountNumber;
  const key = `${body.bankCode}-${body.accountNumber}`;
  console.log(key);
  if(!hasValue(bankList[key]) ){
    
    const accountEnquiryInstance = axios.create({
      method: 'post',
      baseURL: 'https://app.verified.ng',
      timeout: 20000,
      headers: {'Content-Type': 'application/json','api-key': "7UBUKPMxF8i99DgB",'userid':'1543318849803'}, //,'accountNumber':body.accountNumber,'bankcode':key},
    });
    accountEnquiryInstance.post(url,body).then(validateResponse).then((response)=>readResponseAsJSON(response))
    .then((result)=>{
      console.log("Fetch Result");
      // console.log(result);
      if(hasValue(result["inquiry"])){
      
      bankList[key] = result;
      }
      response.isSuccessful=true;
    response.ResponseCode ="00";
    response.ResponseDescription="Account Enquiry was successful";
    response.Data= result;
    
  res.send(response);
    }).catch((err)=>{console.log(err);
      response.ResponseCode="06"
      response.Data = err;
      response.ResponseDescription ="Account Enquiry was not successful"
      console.log(err);
      res.send(response);});
  }
  else{
    console.log("Cached Result");
    response.isSuccessful=true;
    response.ResponseCode ="00";
    response.ResponseDescription="Account Enquiry was successful";
    
    response.Data = bankList[key];
    
    res.send(response);
  }
  }
  catch(err){
    response.ResponseCode="06"
    response.Data = err;
    response.ResponseDescription ="Account Enquiry was not successful"
    console.log(err);
    res.send(response);
  }
  }else{
    response.ResponseCode="06"
    response.Data = "Spam Alert";
    response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
    res.send(response);
  }
});
app.post('/api/sendrepayment',[jsonParser, expAutoSan.route],async (req, res) => {
  let response = {isSuccessful:false, ResponseCode:"06",ResponseDescription:"Processing",Data:null};
  // res.send(response);
  // return;
  if(verifyRequest(req,"sendrepayment")&&spamChecker(req.ip,"sendrepayment")){
  try{
    ProcessRepayment(req.body.email,req.body.payload).then((resp=>{
      res.send(resp);
    })).catch(err=>{
      res.send(err);
    })
  }
  catch(err){
    res.send(err);
  }
  }
 
});
app.post('/api/sendinvestment',[jsonParser, expAutoSan.route],async (req, res) => {
  let response = {isSuccessful:false, ResponseCode:"06",ResponseDescription:"Processing",Data:null};
  if(verifyRequest(req,"investment")&&spamChecker(req.ip,"investment")){
  try{
    ProcessInvestment(req.body.email,req.body.payload).then((resp=>{
      console.log(resp)
      res.send(resp);
    })).catch(err=>{
      res.send(err);
    })
  }
  catch(err){
    res.send(err);
  }
  }
 
});
app.post('/api/sendfeedback',[jsonParser, expAutoSan.route],async (req, res) => {
  let response = {isSuccessful:false, ResponseCode:"06",ResponseDescription:"Processing",Data:null};
  if(verifyRequest(req,"sendfeedback")&&spamChecker(req.ip,"sendfeedback")){
    try{
    const template = `<div style="width:100%; text-align:center; margin-top:40px;"><h3>Customer Feedback</h3><br/><p>${req.body.message}</p></div>`;
    SendEmail({type:'feedback',to:SUPPORT_EMAIL,attachment:null,fileNames:null,html:template,toCustomer:false});
    if(hasValue(req.body.email)){
      SendEmail({type:'feedback',to:req.body.email,attachment:null,fileNames:null,html:"<div style='width:100%; margin-top:40px; text-align:center;'><h3>We appreciate your feedback</h3><p>Thank you for letting us know about your experience</p></div>",toCustomer:true}).then(done=>{
        response.isSuccessful=true;
    response.ResponseCode ="00";
    response.ResponseDescription="Your feedback was submitted successfully";
  res.send(response);
      }).catch(err=>{
       
    response.ResponseCode="06"
    response.Data = err;
    response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
    console.log(err);
    res.send(response);
      })
    }
    
  }
  catch(err){
    response.ResponseCode="06"
    response.Data = err;
    response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
    console.log(err);
    
  res.send(response);
  }
  }
});

/**
 * single(fieldname)
 * Accept a single file with the name fieldname. The single file will be stored in req.file.
 */
app.post('/api/file/upload', [upload.single('file'), expAutoSan.route], async (req, res) => {
  console.log('file upload...')
// console.log(req.body)
  const body = JSON.parse(JSON.stringify(req.body))
  
  console.log('Gotten body')
  // console.log(body)
  // Create a folder based on the file hash and move the default uploaded file under the current hash folder. Facilitate subsequent file merging.
  const {
    name,
    total,
    index,
    size,
    hash
  } = body;
let fileSize = size/1024/1024;
console.log(name)
console.log(hash)
console.log(fileSize);
if(fileSize<=MAXFILEUPLOADSIZE){
  const chunksPath = path.join(uploadPath, hash, '/');
  console.log(chunksPath);
  if(!fsExtra.existsSync(chunksPath)) mkdirsSync(chunksPath);
  fsExtra.renameSync(req.file.path, chunksPath + hash + '-' + index);
  res.status(200);
  res.send(name);
  console.log("Done");
}else{
  console.log("Failed - File chunk too large")
  res.status(400);
  res.send('Failed - File size too large');
  console.log("Done");
}
});

app.post('/api/file/merge_chunks',[jsonParser],async (req, res) => {
  console.log("File merge...");
  const body = JSON.parse(JSON.stringify(req.body));
  const {
    size, name, total, hash
  } = body;
  console.log(name)
console.log(hash)
  try{
let fileSize = size/1024/1024;
console.log(fileSize);
if(fileSize<=MAXFILEUPLOADSIZE){
  // According to the hash value, get the fragmented file.
  // Create a storage file
  // Merger
  const chunksPath = path.join(uploadPath, hash, '/');
  const filePath = path.join(uploadPath, name);
  console.log(chunksPath);
  // Read all chunks file names and store them in an array
  const chunks = fsExtra.readdirSync(chunksPath);
  // Create a storage file
  fsExtra.writeFileSync(filePath, ''); 
  if(chunks.length !== total || chunks.length === 0) {
    res.status = 200;
    res.send ('the number of sliced files does not match');
    console.log("the number of sliced files does not match")
    return;
  }
  for (let i = 0; i < total; i++) {
    // Additional Write to File
    fsExtra.appendFileSync(filePath, fsExtra.readFileSync(chunksPath + hash + '-' +i));
    // Delete the chunk used this time
    fsExtra.unlinkSync(chunksPath + hash + '-' +i);
  }
  fsExtra.rmdirSync(chunksPath);
  // Successful file merging allows file information to be stored.
  res.status(200);
  res.send ('Merged successfully');
}
else{
  console.log("Failed - File chunk too large");
  res.status(400);
  res.send('Failed - File chunk too large');
  console.log("Done");
}
  }catch(ex){
    console.log(ex);
    res.status(400);
  res.send('Failed');
  }
});

module.exports.handler=serverless(app);
