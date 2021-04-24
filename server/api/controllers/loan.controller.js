

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: '100mb'})
const expAutoSan = require('express-autosanitizer');
let timeout = require('connect-timeout')
const {ProcessLoanRequest} = require("@services/implementation/loan-service")
const {verifyRequest,hasValue,spamChecker,createResponse} = require("@services/implementation/common/util")
const loansRouter = require('express').Router();



const ipChecks = {};

loansRouter.get('/', async (req, res) => {
    console.log("Getting Loans");
    res.send("Hello Loans")
  })
  loansRouter.get('/:id', async (req, res) => {
  
  })
  loansRouter.put('/:id', async (req, res) => {
  
  })
  loansRouter.post('/new',[jsonParser, expAutoSan.route,timeout('500s')], async (req, res) => {
    console.log("---------------SEND APPLICATION---------------");
    let response = createResponse();
   
    if(verifyRequest(req,"sendapplication")&&spamChecker(req.ip,"sendapplication")){
      console.log("---------------REQUEST VALIDATED---------------");
     
      try{
        if(hasValue(req.body&&hasValue(req.body.fileName))){
         ProcessLoanRequest(req).then(response=>{
           res.send(response);
         }).catch(err=>{
         throw err;
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
    }else{
      response.ResponseCode="06";
      response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
      console.log(`Spam Suspected ${req.ip} ${JSON.stringify(ipChecks[req.ip])} ${new Date()}`);
      res.send(response);
    }
    console.log("---------------SEND APPLICATION DONE---------------");
    // res.send(response);
  })
  
module.exports = loansRouter;  