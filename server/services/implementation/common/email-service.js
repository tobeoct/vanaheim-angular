
const nodemailer = require('nodemailer');
const LZString = require('lz-string');
const pdfGenerator = require('template-pdf-generator');
const config = require('@config');
const { port, ADMIN_EMAIL, CC_EMAIL} = config;
const {hasValue} = require("./util");

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
  module.exports={
   ProcessFiles, generatePDF,GetFileInBase64,createPDFJson,SendEmail
  }