
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: '100mb'})
const expAutoSan = require('express-autosanitizer');
const axios = require('axios');
const {verifyRequest,hasValue,spamChecker,createResponse,validateResponse,readResponseAsJSON} = require("@services/implementation/common/util")
const accountRouter = require('express').Router();

const instance = axios.create({
  method: 'post',
  baseURL: 'https://app.verified.ng',
  timeout: 20000,
  headers: {'Content-Type': 'application/json','apiKey': "zeb'V8U*-h*e-jO'",'userid':'1543318849803','mode': 'no-cors'},
});
const accountEnquiryInstance = axios.create({
  method: 'post',
  baseURL: 'https://app.verified.ng',
  timeout: 20000,
  headers: {'Content-Type': 'application/json','api-key': "7UBUKPMxF8i99DgB",'userid':'1543318849803'}, //,'accountNumber':body.accountNumber,'bankcode':key},
});

let bvnList={
};
let bankList={};

accountRouter.get('/', async (req, res) => {
  console.log("Getting Common");
  res.send("Hello Common")
})
  
  accountRouter.post('/enquiry',[jsonParser, expAutoSan.route],async (req, res) => {
    let response = createResponse();
    let accountNumber;
    if(verifyRequest(req,"accountenquiry")&&spamChecker(req.ip,"accountenquiry")){
      try{
     let url='/inquiry/api/sacctinq/bvn/wrapper';
    let body ={bankCode:req.body.bankcode,accountNumber:req.body.accountnumber};
    accountNumber = body.accountNumber;
    const key = `${body.bankCode}-${body.accountNumber}`;
    console.log(key);
    if(!hasValue(bankList[key]) ){
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
  
 
  
module.exports = accountRouter;