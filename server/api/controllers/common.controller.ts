
// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json({limit: '100mb'})
// const expAutoSan = require('express-autosanitizer');
// const axios = require('axios');
// const {verifyRequest,hasValue,spamChecker,createResponse,validateResponse,readResponseAsJSON} = require("@services/implementation/common/util")
// const commonRouter = require('express').Router();

import { route, POST } from "awilix-express";
import axios from "axios";
import RedisMiddleware from "server/middleware/redis-middleware";

// const instance = axios.create({
//   method: 'post',
//   baseURL: 'https://app.verified.ng',
//   timeout: 20000,
//   headers: {'Content-Type': 'application/json','apiKey': "zeb'V8U*-h*e-jO'",'userid':'1543318849803','mode': 'no-cors'},
// });
// const accountEnquiryInstance = axios.create({
//   method: 'post',
//   baseURL: 'https://app.verified.ng',
//   timeout: 20000,
//   headers: {'Content-Type': 'application/json','api-key': "7UBUKPMxF8i99DgB",'userid':'1543318849803'}, //,'accountNumber':body.accountNumber,'bankcode':key},
// });

// let bvnList={
// };
// let bankList={};

// commonRouter.get('/', async (req, res) => {
//   console.log("Getting Common");
//   res.send("Hello Common")
// })
// commonRouter.post('/validatebvn',[jsonParser, expAutoSan.route],async (req, res) => {
//     let response = createResponse();
//     if(verifyRequest(req,"validatebvn")&&spamChecker(req.ip,"validatebvn")){
//       try{
//      let url='/bvn-service/api/svalidate/wrapper';
//     let body ={email:req.body.email,bvn:req.body.payload};
//     if(!hasValue(bvnList[body.bvn])){
//       instance.post(url,body).then(validateResponse).then((response)=>readResponseAsJSON(response))
//       .then((result)=>{
//         if(hasValue(result["code"])){
//        bvnList[body.bvn] = result;
//         }
//         response.isSuccessful=true;
//       response.ResponseCode ="00";
//       response.ResponseDescription="Your request was successful";
//       response.Data= result;
      
//     res.send(response);
//       }).catch((err)=>{console.log(err);throw new Error(err);});
//     }else{
//       console.log("Cached Result");
//       response.isSuccessful=true;
//       response.ResponseCode ="00";
//       response.ResponseDescription="Your request was successful";
//       response.Data = bvnList[body.bvn];
//       res.send(response);
//     }
//     }
//     catch(err){
//       response.ResponseCode="06"
//       response.Data = err;
//       response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
//       console.log(err);
//       res.send(response);
//     }
//     }else{
//       response.ResponseCode="06"
//       response.Data = "Spam Alert";
//       response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
//       res.send(response);
//     }
//   });
  
  
//   commonRouter.post('/feedback',[jsonParser, expAutoSan.route],async (req, res) => {
//     let response = createResponse();
//     if(verifyRequest(req,"sendfeedback")&&spamChecker(req.ip,"sendfeedback")){
//       try{
//       const template = `<div style="width:100%; text-align:center; margin-top:40px;"><h3>Customer Feedback</h3><br/><p>${req.body.message}</p></div>`;
//       SendEmail({type:'feedback',to:SUPPORT_EMAIL,attachment:null,fileNames:null,html:template,toCustomer:false});
//       if(hasValue(req.body.email)){
//         SendEmail({type:'feedback',to:req.body.email,attachment:null,fileNames:null,html:"<div style='width:100%; margin-top:40px; text-align:center;'><h3>We appreciate your feedback</h3><p>Thank you for letting us know about your experience</p></div>",toCustomer:true}).then(done=>{
//           response.isSuccessful=true;
//       response.ResponseCode ="00";
//       response.ResponseDescription="Your feedback was submitted successfully";
//     res.send(response);
//         }).catch(err=>{
         
//       response.ResponseCode="06"
//       response.Data = err;
//       response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
//       console.log(err);
//       res.send(response);
//         })
//       }
      
//     }
//     catch(err){
//       response.ResponseCode="06"
//       response.Data = err;
//       response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
//       console.log(err);
      
//     res.send(response);
//     }
//     }
//   });
  
  
// module.exports = commonRouter;
// const bvnList:any={};

@route('/api/common')
export default class CommonController {
constructor(private _redis:RedisMiddleware){

}
    
instance = axios.create({
    method: 'post',
    baseURL: 'https://app.verified.ng',
    timeout: 20000,
    headers: {'Content-Type': 'application/json','apiKey': "zeb'V8U*-h*e-jO'",'userid':'1543318849803','mode': 'no-cors'},
  });

    @route('/validatebvn')
    @POST()
    validateBVN =async (req:any, res:any,next:any) => {
    // if(verifyRequest(req,"validatebvn")&&spamChecker(req.ip,"validatebvn")){
        let key = "bvnList";
        let bvnList:any = await this._redis.get(key,{});
     try {
        let url = '/bvn-service/api/svalidate/wrapper';
        let body = { email: req.session?.userData?.email||'support@vanircapital.org', bvn: req.body.payload };
        if(bvnList[body.bvn]===undefined){
            let result = await this.instance.post(url, body); 
            if (result.data["code"]&&result.data["code"]=="00") {
                bvnList[result.data["bvn"]] = result.data["basicDetails"];
                res.statusCode = 200;
                res.data = {message:"BVN Verified"};
            }
            else {
                if(result.data["code"]!="00") bvnList[body.bvn] =null;
                res.statusCode = 400;
                res.data = {message:"BVN verification failed"};
            }
        }else{
            res.statusCode = bvnList[body.bvn]===null?400: 200;
            res.data = { message: bvnList[body.bvn]===null?"BVN Verification Failed":"BVN Verified" };
        }
    }
    catch (err) {
        console.log(err);
        res.statusCode = 500;
        res.data = err;
    }

    await this._redis.save(key,bvnList);
    next();
  }

}