const {SendEmail} = require("./common/email-service");
const {ProcessPDF} = require("./loan-service");
const { ADMIN_EMAIL } = require('@config');
const mailHeader="";
const ProcessRepayment=(email:string,payload:any)=>new Promise((resolve,reject)=>{
    let response = createResponse();
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
      ProcessPDF(payload,fileName.trim(),"repayment").then((template:any)=>{
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
    }).catch((err:any)=>{
      console.log(err);
      reject(response);
    });
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

  const getAll=(requestId:string)=>{
    return new Promise((resolve, reject) =>{});
  }
  module.exports = {
    ProcessRepayment
    }