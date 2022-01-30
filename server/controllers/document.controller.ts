
const path = require('path');
import { Customer } from '@entities/customer';
import { ILoanRequestRepository } from '@repository/interface/loan/Iloan-request-repository';
import { IDocumentService } from '@services/interfaces/Idocument-service';
import { GET, POST, route } from 'awilix-express';
import { DocumentUpload } from 'src/app/modules/loan/shared/document-upload/document';
import { Document } from '@entities/document';
import { LoanRequest } from 'server/entities/loan/loan-request';
import { IDocumentRepository } from '@repository/interface/document/Idocument-repository';
import AppConfig from 'server/config';
import EmailService, { EmailType } from '@services/implementation/common/email-service';
import { TemplateService } from '@services/implementation/common/template-service';
import { VanaheimBodyRequest, VanaheimQueryRequest } from '@models/express/request';
import { VanaheimTypedResponse } from '@models/express/response';
@route('/api/document')
export default class DocumentController {

  bvnList: any = {
  };
  bankList: any = {};
  constructor(private _appConfig: AppConfig, private _templateService: TemplateService, private _emailService: EmailService, private _documentService: IDocumentService, private _documentRepository: IDocumentRepository, private _loanRequestRepository: ILoanRequestRepository) {

  }

  @route('/attachLoan')
  @GET()
  attachLoan = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
    try {
      let customer = req.session.userData.customer;
      if (customer) {
        let { documentID, loanRequestID, loanRequestLogID } = req.query;
        let docInDb: any = await this._documentRepository.getById(documentID);

        if (docInDb && Object.keys(docInDb).length > 0) {
          let loanRequest = await this._loanRequestRepository.getById(loanRequestID) as LoanRequest;
          let doc = docInDb.dataValues as Document
          doc.requestId =loanRequest.requestId;
          // doc.loanRequestLogID = loanRequestLogID;
          await this._documentService.update(doc)
          try {
            let sent = await this._emailService.SendEmail({ type: EmailType.Update, to: this._appConfig.OPS_EMAIL, attachment: doc.path, html: this._templateService.LOAN_DOCUMENT_UPDATE_NOTIFICATION(customer.firstName+" "+customer.lastName, loanRequest.code,doc.requirement), toCustomer: false })
          } catch (err) {
            console.log("Loan Update Email failed to send");
            console.log(err);
          }
        }
        res.statusCode = 200;
        res.payload = {message:"Document Uploaded"}
        next();
      } else {
        res.statusCode = 400;
        res.payload = { message: "Invalid User" }
        next();

      }
    } catch (err) {
      res.statusCode = 400;
      res.payload = { message: "An error occurred" }
      next();
    }
  }
  @route('/upload')
  @POST()
  upload = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {

    if (req.session.userData.customer) {
      let documentUpload = req.body as DocumentUpload;
      let customer = req.session.userData.customer as Customer;
      let response = await this._documentService.processDocument(documentUpload, customer);
      if (response.status == true) {
        res.statusCode = 200;
        res.payload = {data:response.data};
      } else {
        res.statusCode = 400;
        res.payload = {message:response.message};
      }
      next();
    } else {
      res.statusCode = 400;
      res.payload = {message:"Invalid User"}
      next()
    }
  }
  @route('/getAll')
  @GET()
  getAll = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {

    if (req.session.userData.customer) {
      let customer = req.session.userData.customer as Customer;
      let response = await this._documentService.getByCustomerID(customer.id);
      if (response.status = true) {
        res.statusCode = 200;
      } else {
        res.statusCode = 400;
      }
      res.payload = {data:response.data};
    } else {
      res.statusCode = 400;
      res.payload = {message:"Couldn't fetch documents"}

    }
    next();
  }

  @route('/download')
  @POST()
  download = async (req: VanaheimBodyRequest<any>, res: any) => {
    const url = req.body.url;
    // let base = this._appConfig.environment==Environment.development? "../": "../../" 
    // const root = path.dirname(require.main?.filename)
    // const file = path.resolve(root, url);
    // console.log("FILE", file, root);
    res.download(url);
    // res.download(this._appConfig.environment==Environment.production?"../../" + url:file);
  }
}