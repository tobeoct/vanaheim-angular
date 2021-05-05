import AppConfig from "@config";
import UtilService from "./util";
const path = require('path');
const nodemailer = require('nodemailer');
const LZString = require('lz-string');
const pdfGenerator = require('template-pdf-generator');
const fs = require('fs');
const multer = require('multer');
const fsExtra = require('fs-extra');
const { mkdirsSync } = require('@utils/dir');
const uploadPath = path.join("../../../", 'uploads');
const uploadTempPath = path.join(uploadPath, 'temp');
const upload = multer({ dest: uploadTempPath });
let FileAPI = require('file-api')
, File = FileAPI.File
, FileList = FileAPI.FileList
, FileReader = FileAPI.FileReader,reader = new FileReader();

export default class EmailService{
bvnList:any[]=[];
ADMIN_EMAIL:string;
CC_EMAIL:string;
constructor(private _utilService:UtilService,private _appConfig:AppConfig){

}
  SendEmail=async({subject,to,attachment,fileNames,html,toCustomer,type}:any)=>{
  return new Promise((resolve,reject)=>{
//const SendEmail=({subject,to,attachment,fileNames,html,toCustomer,type})=>new Promise((resolve,reject)=>{
  console.log("---------------SENDING EMAIL---------------");
  let transporterOptions:any = {
    // service: 'gmail',
    host: this._appConfig.HOST,
    port: 465,
    secure:this._appConfig.ISSECURE === 'true', // use SSL
   
    auth: {
      user: this._appConfig.LOAN_EMAIL,
      pass:this._appConfig.LOAN_EMAIL_PASS
    }
  };
  if(this._appConfig.SERVICE) transporterOptions["service"] ="gmail";
  this.ADMIN_EMAIL= this._appConfig.LOAN_EMAIL ||'';
  this.CC_EMAIL = this._appConfig.LOAN_EMAIL||'';
  try{
  switch(type){
    case "form":
      subject = toCustomer?'Vanir Capital: Your Loan Application Is Completed':'JUST IN! New Application';
      break;
    case "feedback":
      subject = toCustomer?'Vanir Capital: Thanks For The Feedback':'A Customer Gave A Feedback';
      transporterOptions.auth = {
          user: this._appConfig.SUPPORT_EMAIL,
          pass:this._appConfig.SUPPORT_EMAIL_PASS
        };
      
      this.ADMIN_EMAIL = this._appConfig.SUPPORT_EMAIL ||'';
      this.CC_EMAIL = this._appConfig.SUPPORT_EMAIL||'';
      break;
    case "repayment":
      subject = toCustomer?'Vanir Capital: Your Repayment Plan':'A Customer Requested For A Repayment Plan';
      break;
      case "investment":
      subject = toCustomer?'Vanir Capital: Investment Indication':'Investment Indication';
      transporterOptions.auth = {
          user: this._appConfig.INVESTMENT_EMAIL,
          pass:this._appConfig.INVESTMENT_EMAIL_PASS
        };
      
      this.ADMIN_EMAIL = this._appConfig.INVESTMENT_EMAIL||'';
      this.CC_EMAIL = this._appConfig.INVESTMENT_EMAIL||'';
      break;
  }
 const transporter = nodemailer.createTransport(transporterOptions);
  // <img src="cid:myLogo" style=" width:100px;  margin-bottom:10px"
  let mailOptions:any = {
    from:this.ADMIN_EMAIL,
    to: to.trim(),
    subject:subject,
    html :`<div style="padding-top:5vh;padding-bottom:0px; font-family:'Roboto','Arial','Helvetica',sans-serif'; width:100% !important;"><div style="width:100% !important;  height:auto; text-align:center; min-width:500px; margin-bottom:0px;">
    
      <h1 style="margin-top:10px;"><b>Vanir Capital</b></h1>
    </div>`,
    attachments:[
     
    ]
  };
  if(this._utilService.hasValue(attachment)){
    console.log(`./uploads/${attachment.trim()}.pdf`)
    mailOptions["attachments"].push({   // file on disk as an attachment 
    filename: `${attachment.split('-')[0].replace("static/",'').trim()}.pdf` ,
    path: `./uploads/${attachment.trim()}.pdf` // stream this file
  });
    }
    if(this._utilService.hasValue(fileNames)){
      
      if(!this._utilService.hasValue(mailOptions["attachments"]))mailOptions["attachments"]=[]
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
    mailOptions['cc']= this.CC_EMAIL;//"tobe.onyema@gmail.com";
    if(!this._utilService.hasValue(html)){
    mailOptions["html"]+=`<b>You just got a new application</b> <br/> <b>Name:</b> ${attachment.split('-')[0]} <br/> <b>Phone Number:</b> ${attachment.split('-')[1]}`;
    }else{
      mailOptions["html"]+=html;
    }
   
  }
  else{
   // mailOptions['cc']= CC_EMAIL;
    if(!this._utilService.hasValue(html)){
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
transporter.sendMail(mailOptions, function(error:any, info:any){
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



  createPDFJson=(application:any)=>{
    // console.log(application);
    if(!this._utilService.hasValue(application)) throw new Error("Invalid Application");
    let docDataSet ={};
    let invalid =0
    let total = Object.keys(application).length;
    for(let item in application){
      const prefix = application[item].pageTitle;
      if(this._utilService.hasValue(application[item])){
        total+=Object.keys(application[item]).length
      for(let entry in application[item]){
        if(this._utilService.hasValue(application[item][entry])){
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


 GetFileInBase64=async(file:any)=> {
    let response ;
    const result = await this.toBase64(file).then((f)=>response=f).catch(e => Error(e));
    if(result instanceof Error) {
       console.log('Error: ', result.message);
       return null;
    }
    return response;
    //...
  }
   toBase64 = (file:any) => new Promise((resolve, reject) => {
   try{
    // const reader = new FileReader();
    reader.readAsDataURL(new File(file));
    reader.onload = () =>{
      
      resolve(reader.result);
      // }
    }
    reader.onerror = (error:any) => {
      console.log(error);
      this.toBase64(file).then((f)=>resolve(f)).catch(err=>reject(err));
      // reject(error);
    }
  }catch(error){
    console.log(error);
      this.toBase64(file).then((f)=>resolve(f)).catch(err=>reject(err));
      
  }
  });
   createReadStream=(file:any,bitmap:any)=>new Promise((resolve,reject)=>{
    fs.createReadStream(`${file}`, { encoding: 'base64' }).on('data', function (data:any) {
      // console.log('got data', data);
      bitmap+=data;
    }).on('end',  () => {
        console.log('No more data');
        if(this._utilService.hasValue(bitmap)){
        resolve(bitmap);
        }else{
           fs.createReadStream(file,bitmap).then((map:any)=>{
             bitmap=map;
             if(this._utilService.hasValue(bitmap)) resolve(bitmap);
          });
        }
      });
  });
   generatePDF=(data:any,template:any,css:any,fileName:any)=>new Promise((resolve,reject)=>{
    try{
    resolve(pdfGenerator(data, template, css).pipe(fs.createWriteStream(`./uploads/${fileName}.pdf`)));
    }catch(err){
      reject(err);
    }
  });
   base64MimeType=(encoded:any) =>{
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
   ProcessFiles=(files:any,bvnVer:any) => new Promise((resolve, reject) => {
   // console.log(files)
    let fileNames:any[] = [];
    let bvnFile;
    if(this._utilService.hasValue(files)){
      for(let item in files){
        fileNames.push(files[item]);
      }
      //Send bvn information to VCAP
      let shouldProceed = false;
      if(this._utilService.hasValue(bvnVer)){
        if(this._utilService.hasValue(bvnVer["BVN"])){
          if(this._utilService.hasValue(this.bvnList[bvnVer["BVN"]])){
          if(this._utilService.hasValue(this.bvnList[bvnVer["BVN"]]["basicDetails"])){
            shouldProceed = true;
          }}}}
            if(shouldProceed){
        //console.log(bvnVer["BVN"]);
        let item ="BVN Details To VCAP.jpg";
      files["BVN Details To VCAP.jpg"] =  LZString.compress( `data:image/jpg;base64,${this.bvnList[bvnVer["BVN"]]["basicDetails"]}`);
      let base64String = LZString.decompress(files[item]); // Not a real image
      let mime:any = this.base64MimeType(base64String);
      // console.log(item);
      // console.log(mime);
      if(this._utilService.hasValue(mime)){
        mime = mime.split('/')[1];
  // Remove header
  let itemName=`${item.split('.')[0]}-${Date.now()}.${mime}`;
      fileNames.push(itemName);
  let base64Image = base64String.split(';base64,').pop();
  fs.writeFile(`./uploads/${itemName}`, base64Image, {encoding: 'base64'}, function(err:any) {
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
}