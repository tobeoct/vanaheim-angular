import UtilService  from '@services/implementation/common/util';
import { GET, POST, route,before } from 'awilix-express'; 
import axios from 'axios';
const expAutoSan = require('express-autosanitizer');
@route('/api/account')
export default class AccountController {

  instance = axios.create({
    method: 'post',
    baseURL: 'https://app.verified.ng',
    timeout: 20000,
    headers: {'Content-Type': 'application/json','apiKey': "zeb'V8U*-h*e-jO'",'userid':'1543318849803','mode': 'no-cors'},
  });
   accountEnquiryInstance = axios.create({
    method: 'post',
    baseURL: 'https://app.verified.ng',
    timeout: 20000,
    headers: {'Content-Type': 'application/json','api-key': "7UBUKPMxF8i99DgB",'userid':'1543318849803'}, //,'accountNumber':body.accountNumber,'bankcode':key},
  });
  
   bvnList:any={
  };
   bankList:any={};
    constructor(private _utilService:UtilService) {

    }
    @route('/enquiry')
    @before([ expAutoSan.route])
    @POST()
     enquiry=(req:any, res:any) => {
      let response = this._utilService.createResponse();
      let accountNumber;
      if(this._utilService.verifyRequest(req,"accountenquiry")&&this._utilService.spamChecker(req.ip,"accountenquiry")){
        try{
       let url='/inquiry/api/sacctinq/bvn/wrapper';
      let body ={bankCode:req.body.bankcode,accountNumber:req.body.accountnumber};
      accountNumber = body.accountNumber;
      const key = `${body.bankCode}-${body.accountNumber}`;
      console.log(key);
      if(!this._utilService.hasValue(this.bankList[key]) ){
        this.accountEnquiryInstance.post(url,body).then(this._utilService.validateResponse).then((response:any)=>this._utilService.readResponseAsJSON(response))
        .then((result:any)=>{
          console.log("Fetch Result");
          // console.log(result);
          if(this._utilService.hasValue(result["inquiry"])){
          
          this.bankList[key] = result;
          }
          response.isSuccessful=true;
        response.ResponseCode ="00";
        response.ResponseDescription="Account Enquiry was successful";
        response.Data= result;
        
      res.send(response);
        }).catch((err:any)=>{console.log(err);
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
        
        response.Data = this.bankList[key];
        
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
    }
}