
import { IDisbursedLoanService } from '@services/interfaces/loan/Idisbursed-loan-service';
import { ILoanRequestLogService } from '@services/interfaces/loan/Iloan-log-request-service';
import { ILoanRequestService } from '@services/interfaces/loan/Iloan-request-service';
import { ILoanService } from '@services/interfaces/loan/Iloanservice';
import { GET, POST, route } from 'awilix-express'; 
@route('/api/loans')
export default class UserController {

   bvnList:any={
  };
   bankList:any={};
    constructor( private sanitizer:any,private _loanService:ILoanService, private _disbursedLoanService:IDisbursedLoanService,private _loanRequestService:ILoanRequestService,private _loanRequestLogService:ILoanRequestLogService) {

    }

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
        console.log("Searching Logs");
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
    @route('/searchToProcess')
    @POST()
    searchForAdmin =async (req:any, res:any,next:any) => {
        console.log("Searching Logs");
        let response:any = await this._loanRequestService.search(req.body);
        if(response.status==true){
            res.statusCode = 200;
            res.data = response.data
        }else{
            res.statusCode = 400;
            res.data = response;
        }
    
        next()
    }
    @route('/getLoanDetails')
    @GET()
    getLoanDetails =async (req:any, res:any,next:any) => {
        var id = this.sanitizer.escape(req.query.id);
        let response:any = await this._loanService.getLoanDetails(id,"loanRequest");
        if(response.status==true){
            res.statusCode = 200;
            res.data = response.data
        }else{
            res.statusCode = 400;
            res.data = response;
        }
    
        next()
    }
    @route('/getLoanLogDetails')
    @GET()
    getLoanLogDetails =async (req:any, res:any,next:any) => {
        var id = this.sanitizer.escape(req.query.id);
        let response:any = await this._loanService.getLoanDetails(id,"loanRequestLog");
        if(response.status==true){
            res.statusCode = 200;
            res.data = response.data
        }else{
            res.statusCode = 400;
            res.data = response;
        }
    
        next()
    }
    @route('/getDisbursedLoan')
    @GET()
    getDisbursedLoans =async (req:any, res:any,next:any) => {
        var id = this.sanitizer.escape(req.query.requestId);
        let response:any = await this._disbursedLoanService.getDisbursedLoanById(id);
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
        let {status,id,failureReason,message} = req.body
        let response:any = await this._loanService.updateStatus({requestStatus:status,id,failureReason,message});
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