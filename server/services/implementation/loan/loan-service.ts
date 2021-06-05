import AppConfig from "@api/config";
import { Customer } from "@models/customer";
import { Document } from "@models/document";
import { LoanRequestStatus } from "@models/helpers/enums/loanrequeststatus";
import { LoanRequest } from "@models/loan/loan-request";
import { LoanRequestLog } from "@models/loan/loan-request-log";
import { WebNotData, WebNotification } from "@models/webnotification";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { IDocumentService } from "@services/interfaces/Idocument-service";
import { INotificationService } from "@services/interfaces/Inotification-service";
import { ILoanRequestLogService } from "@services/interfaces/loan/Iloan-log-request-service";
import { ILoanRequestService } from "@services/interfaces/loan/Iloan-request-service";
import { ILoanService } from "@services/interfaces/loan/Iloanservice";
import { BVN } from "src/app/modules/loan/personal/bvn/bvn";
import EmailService from "../common/email-service";
import { TemplateService } from "../common/template-service";
import UtilService from "../common/util";
  
export class LoanService implements ILoanService{
  constructor(private _appConfig:AppConfig,private _notificationService:INotificationService,private _documentService:IDocumentService,private _templateService: TemplateService,private _emailService:EmailService,private _customerRepository:ICustomerRepository, private _loanRequestService:ILoanRequestService,private _utilService:UtilService, private _loanRequestLogService:ILoanRequestLogService){

  }
 getAllLoanRequests: () => Promise<LoanRequest[]>;
 getAllLoanRequestLogs: () => Promise<LoanRequestLog[]>;
 getLoanRequestById: () => Promise<LoanRequest>;
 getLoanRequestLogById: () => Promise<LoanRequestLog>;
 updateLoanRequest= (loanRequest: LoanRequest) =>  new Promise<LoanRequest>(async (resolve,reject)=>{
     try{
    let request = await this._loanRequestService.update(loanRequest);
      resolve(request);
     }catch(err){
         reject(err);
     }
  })
  updateStatus= ({requestStatus,id}:any) =>  new Promise<any>(async (resolve,reject)=>{
    try{
      let loanRequest = await this._loanRequestService.getById(id);
      if(!loanRequest || Object.keys(loanRequest).length==0) throw "Invalid Loan Request";
      let loanRequestLog = await this._loanRequestLogService.getByLoanRequestIDAndRequestDate({loanRequestID:loanRequest.id,requestDate:loanRequest.requestDate})
      if(!loanRequestLog || Object.keys(loanRequestLog).length==0) throw "Invalid Loan Request log";
      let status = requestStatus as unknown as LoanRequestStatus;
      loanRequest.requestStatus = status;
      loanRequest.updatedAt = new Date();
      await this._loanRequestService.update(loanRequest);

      loanRequestLog.requestStatus = status;
      loanRequestLog.updatedAt = new Date();
      await this._loanRequestLogService.update(loanRequestLog);
      if(status== LoanRequestStatus.Funded){
        //create disbursed loan record
      }
      resolve({status:true,loanRequest});
    }catch(err){
      console.log(err)
      resolve({status:false})
    }
  });
 
  restructure: (disbursedLoanId: number, repayment: number) => Promise<boolean>;
  processLoanRequest= (request: any,userData:any) =>  new Promise<any>(async (resolve,reject)=>{
    try{
    const customer = await this._customerRepository.getByUserID(userData.id);
    if(!customer || Object.keys(customer).length==0){
       //not yet a customer
       throw "Not yet a customer, kindly register to be able to reapply";
    }
    let c= Object.assign(customer.dataValues as Customer,new Customer());
    console.log("Customer",c)
    let {loanRequest,templates} = await this._loanRequestService.createLoanRequest(request,c);


     //Send Email to support and customer
       const loanApplication = request.loanApplication;
     let documents =  JSON.parse(loanApplication.documents)
     let documentPath=[];
     for(let key in documents){
       const d = documents[key];
       let docInDb:any =await this._documentService.getById(d.id);
       if(docInDb){
       let doc:Document = Object.assign(docInDb.dataValues as Document, new Document())
       documentPath.push(doc.url);
       }
     }

let bvnInfo = JSON.parse(loanApplication.bvn) as BVN;
let bvnFileResponse = await this._documentService.getBVNDocument(bvnInfo.bvn,c.code);
  if(bvnFileResponse.status==true){
    documentPath.push(bvnFileResponse.file.path);
  }
    let {path,template}:any = await this._templateService.generatePDF("Loan Application",templates,customer.code+"/"+loanRequest.requestId)
    let sent = await this._emailService.SendEmail({type:'form',to:this._appConfig.ADMIN_EMAIL,attachment:path,filePaths:documentPath,html:template,toCustomer:false})
   await this._emailService.SendEmail({type:'form',to:customer.email,attachment:path,filePaths:null,html:this._templateService.LOAN_CUSTOMER_TEMPLATE,toCustomer:true})
   let notification:WebNotification = new WebNotification();
                notification.title = "Vanaheim by Vanir Capital";
                notification.body = "Your have successfully applied for a loan";
                notification.vibrate = [100, 50, 100]
                notification.icon= 'https://i.tracxn.com/logo/company/Capture_6b9f9292-b7c5-405a-93ff-3081c395624c.PNG?height=120&width=120';
                notification.data = new WebNotData();
                notification.data.url = "http://localhost:4201/my/loans";
   await this._notificationService.sendNotificationToMany({customerIds:[customer.id],notification})
    resolve({status:true,data:{loanRequestId: loanRequest.requestId}});
    }catch(err){
      resolve({status:false,message:err});
    }
  });
  

}