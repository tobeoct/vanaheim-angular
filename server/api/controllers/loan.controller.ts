

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json({limit: '100mb'})
// const expAutoSan = require('express-autosanitizer');
// let timeout = require('connect-timeout')
// const {ProcessLoanRequest} = require("@services/implementation/loan/loan-service")
// const {verifyRequest,hasValue,spamChecker,createResponse} = require("@services/implementation/common/util")
// const loansRouter = require('express').Router();



// const ipChecks = {};

// loansRouter.get('/', async (req, res) => {
//     console.log("Getting Loans");
//     res.send("Hello Loans")
//   })
//   loansRouter.get('/:id', async (req, res) => {
  
//   })
//   loansRouter.put('/:id', async (req, res) => {
  
//   })
//   loansRouter.post('/new',[jsonParser, expAutoSan.route,timeout('500s')], async (req, res) => {
//     console.log("---------------SEND APPLICATION---------------");
//     let response = createResponse();
   
//     if(verifyRequest(req,"sendapplication")&&spamChecker(req.ip,"sendapplication")){
//       console.log("---------------REQUEST VALIDATED---------------");
     
//       try{
//         if(hasValue(req.body&&hasValue(req.body.fileName))){
//          ProcessLoanRequest(req).then(response=>{
//            res.send(response);
//          }).catch(err=>{
//          throw err;
//          })
       
//         }
//       }
//       catch(err){
//         response.ResponseCode="06"
//         response.Data = err;
//         response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
//         console.log(err);
//         res.send(response);
//       }
//     }else{
//       response.ResponseCode="06";
//       response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
//       console.log(`Spam Suspected ${req.ip} ${JSON.stringify(ipChecks[req.ip])} ${new Date()}`);
//       res.send(response);
//     }
//     console.log("---------------SEND APPLICATION DONE---------------");
//     // res.send(response);
//   })
  
// module.exports = loansRouter;  




import { ILoanRequestLogService } from '@services/interfaces/loan/Iloan-log-request-service';
import { ILoanRequestService } from '@services/interfaces/loan/Iloan-request-service';
import { ILoanService } from '@services/interfaces/loan/Iloanservice';
import { GET, POST, route } from 'awilix-express'; 
@route('/api/loans')
export default class UserController {

   bvnList:any={
  };
   bankList:any={};
    constructor(private _loanService:ILoanService,private _loanRequestService:ILoanRequestService,private _loanRequestLogService:ILoanRequestLogService) {

    }
    // @route('/:id')
    // @GET()
    // getById =async () => {
  
    //     }

    @route('/getAllLoanRequests')
    @GET()
    getAllLoanRequests = async (req:any, res:any,next:any) => {
          console.log("Loans Controller", req.session)
          let loanRequests =  await this._loanService.getAllLoanRequests();
          res.statusCode = 200;
          res.data = loanRequests;
      
          next()
      
        }

    @route('/create')
    @POST()
    new =async (req:any, res:any,next:any) => {
        let response:any = await this._loanService.processLoanRequest(req.body, req.session.userData);
        if(response.status==true){
            res.statusCode = 200;
            res.data = response.data
        }else{
            res.statusCode = 400;
            res.data = response;
        }
    
        next()
    }

    @route('/search')
    @POST()
    search =async (req:any, res:any,next:any) => {
        let response:any = await this._loanRequestLogService.search(req.body,req.session.userData.customer);
        if(response.status==true){
            res.statusCode = 200;
            res.data = response.data
        }else{
            res.statusCode = 400;
            res.data = response;
        }
    
        next()
    }
    @route('/updateStatus')
    @POST()
    updateStatus =async (req:any, res:any,next:any) => {
        let {requestStatus,id} = req.body
        let response:any = await this._loanService.updateStatus({requestStatus,id});
        if(response.status==true){
            res.statusCode = 200;
            res.data = response.data
        }else{
            res.statusCode = 400;
            res.data = response;
        }
    
        next()
    }

    @route('/getLatestLoan')
    @GET()
    getLatestLoan =async (req:any, res:any,next:any) => {
        console.log("Getting Latest Loan")
        let response:any = await this._loanRequestService.getLatestLoan(req.session.userData);
        if(response.status==true){
            res.statusCode = 200;
            res.data = response.data;
        }else{
            res.statusCode = 400;
            res.data = response;
        }
        
    
        next()
    }
}