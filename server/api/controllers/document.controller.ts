
const path = require('path');
import { Customer } from '@models/customer';
import { ILoanRequestRepository } from '@repository/interface/loan/Iloan-request-repository';
import { IDocumentService } from '@services/interfaces/Idocument-service';
import { GET, POST, route } from 'awilix-express';
import { DocumentUpload } from 'src/app/modules/loan/shared/document-upload/document';
import { Document } from '@models/document';
import { LoanRequest } from '@models/loan/loan-request';
import { IDocumentRepository } from '@repository/interface/document/Idocument-repository';
import AppConfig, { Environment } from '@api/config';
@route('/api/document')
export default class DocumentController {

  bvnList: any = {
  };
  bankList: any = {};
  constructor(private _appConfig:AppConfig,private _documentService: IDocumentService, private _documentRepository:IDocumentRepository, private _loanRequestRepository: ILoanRequestRepository) {

  }

  @route('/attachLoan')
  @GET()
  attachLoan = async (req: any, res: any, next: any) => {
    try {
      if (req.session.userData.customer) {
        let { documentID, loanRequestID } = req.query;
        let docInDb: any = await this._documentRepository.getById(documentID);

        if (docInDb && Object.keys(docInDb).length > 0) {
          let doc = docInDb.dataValues
          doc.loanRequestID = loanRequestID;
          await this._documentService.update(doc)
        }
        res.statusCode = 200;
        res.data = "Document Uploaded"
        next();
      } else {
        res.statusCode = 400;
        res.data = { message: "Invalid User" }

      }
    } catch (err) {
      res.statusCode = 400;
      res.data = { message: "An error occurred" }
    }
  }
  @route('/upload')
  @POST()
  upload = async (req: any, res: any, next: any) => {

    if (req.session.userData.customer) {
      let documentUpload = req.body as DocumentUpload;
      let customer = req.session.userData.customer as Customer;
      let response = await this._documentService.processDocument(documentUpload, customer);
      if (response.status = true) {
        res.statusCode = 200;
      } else {
        res.statusCode = 400;
      }
      res.data = response.data;
      next();
    } else {
      res.statusCode = 400;
      res.data = {}

    }
  }
  @route('/getAll')
  @GET()
  getAll = async (req: any, res: any, next: any) => {

    if (req.session.userData.customer) {
      let customer = req.session.userData.customer as Customer;
      let response = await this._documentService.getByCustomerID(customer.id);
      if (response.status = true) {
        res.statusCode = 200;
      } else {
        res.statusCode = 400;
      }
      res.data = response.data;
    } else {
      res.statusCode = 400;
      res.data = {}

    }
    next();
  }

  @route('/download')
  @POST()
  download = async (req: any, res: any) => {
    const url = req.body.url;
    let base = this._appConfig.environment==Environment.development? "../../../": "../../../../../" 
    const file = path.resolve(__dirname, base + url);
    console.log("FILE", file,__dirname);
    res.download(path.resolve(url));
    // /app/dist/server/uploads/CUST_28562021125600/d72bc64ad82178b82e0517857dfae099.jpg
  }
}