
import { BaseService } from "./base-service";
import { IDocumentRepository } from "@repository/interface/document/Idocument-repository";
import { IDocumentService } from "@services/interfaces/Idocument-service";
import { DocumentUpload } from "src/app/modules/loan/shared/document-upload/document";
import { Customer } from "@models/customer";
import mkdirsSync from "@models/helpers/utils/dir";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
const path = require('path');
import UtilService from "./common/util";
import { Document } from "@models/document";
import { BaseStatus } from "@models/helpers/enums/status";
import RedisMiddleware from "server/middleware/redis-middleware";
import { Cloudinary } from "./image/cloudinary-service";
import LZString = require("lz-string");
import { AWSService } from "./image/aws-service";

class DocumentService extends BaseService<any> implements IDocumentService {
    constructor(_documentRepository: IDocumentRepository,private _cloudinaryService:Cloudinary,private _awsService:AWSService, private _redis: RedisMiddleware, private fs: any, private fsExtra: any, private _utils: UtilService, private md5: any) {
        super(_documentRepository)
    }
    getByLoanRequestId = (loanRequestId: string) => new Promise<any>(async (resolve, reject) => {
        try {
            let repo = this._baseRepository as IDocumentRepository;
            let documents = await repo.getByLoanRequestId(loanRequestId);
            resolve({ status: true, data: documents });
        } catch (err:any) {
            console.log(err.message);
            resolve({ status: false, data: err });
        }
    });
    getByLoanRequest = (loanRequestId: number,loanRequestLogId: number) => new Promise<any>(async (resolve, reject) => {
        try {
            let repo = this._baseRepository as IDocumentRepository;
            let documents = await repo.getByLoanRequest(loanRequestId,loanRequestLogId);
            resolve({ status: true, data: documents });
        } catch (err:any) {
            console.log(err.message);
            resolve({ status: false, data: err });
        }
    });
    getByCustomerID = (customerID: number) => new Promise<any>(async (resolve, reject) => {
        try {
            // const customer = await this._customerRepository.getByUserID(userData.id);
            // let c = customer.dataValues as Customer;
            let repo = this._baseRepository as IDocumentRepository;
            let documents = await repo.getByCustomerID(customerID);
            resolve({ status: true, data: documents });
        } catch (err:any) {
            console.log(err.message);
            resolve({ status: false, data: err });
        }
    });
    createDocument = (fileName: string, base64String: string, customerCode: string) => new Promise<any>(async (resolve, reject) => {
        try {
            let base64 = base64String.split(';base64,').pop();
            let extension = this._utils.getFileExtension(fileName);
            let name = this.md5(base64) + '.' + extension;
            const root =path.dirname(require.main?.filename)
            const uploadsPath = path.resolve(root,"uploads");
            let filePath =uploadsPath+"/" + customerCode + "/" + name;
            if (!this.fsExtra.existsSync(uploadsPath)) mkdirsSync(uploadsPath);
            if (!this.fsExtra.existsSync(`${uploadsPath}/` + customerCode)) mkdirsSync(`${uploadsPath}/` + customerCode);
            if (!this.fsExtra.existsSync(filePath)) {
                this.fs.writeFile(filePath, base64, { encoding: 'base64' }, async  () =>{
                    console.log('File created');
                    console.log(filePath)
                    // let url = await this._cloudinaryService.upload(filePath, name);
                    let url = await this._awsService.upload(filePath,fileName,customerCode);
                    resolve({ name, extension, path: filePath, url })
                });
            } else {
                // let url = await this._cloudinaryService.upload(filePath, name);
                let url = await this._awsService.upload(filePath,fileName,customerCode);
                resolve({ name, extension, path: filePath, url })
            }
        } catch (err:any) {
            console.log(err);
            reject(err);
        }
    })
    processDocument = (documentUpload: DocumentUpload, c: Customer) => new Promise<any>(async (resolve, reject) => {
        try {
            // const customer = await this._customerRepository.getByUserID(userData.id);
            // let c = customer.dataValues as Customer;
            const base64String =documentUpload.data;// LZString.decompress(documentUpload.data)||"";
            let file = await this.createDocument(documentUpload.document.fileName, base64String, c.code)
            let repo = this._baseRepository as IDocumentRepository;
            let documentsInDb = await repo.getByCustomerID(c.id) as Document[];
            let documentInDb = documentsInDb.find(doc => {
                return doc.fileName == file.name && doc.requirement == documentUpload.document.label;
            });
            if (!documentInDb) {
                let document = new Document();
                document.fileName = file.name;
                document.name = documentUpload.document.fileName;
                document.status = BaseStatus.Active;
                document.code = this._utils.autogenerate({ prefix: "DOC" });
                document.extension = file.extension;
                document.createdAt = new Date();
                document.path = file.path;
                document.url = file.url;
                document.requirement = documentUpload.document.label;
                document.customerID = c.id;
                documentInDb = await repo.create(document);
            }
            resolve({ status: true, data: documentInDb });
        } catch (err:any) {
            console.log(err.message);
            resolve({ status: false, data: "Error uploading document" });
        }
    })
    getBVNDocument = (bvn: string, customerCode: string) => new Promise<any>(async (resolve, reject) => {
        try {
            let bvnList: any = await this._redis.get("bvnList", {});
            //Send bvn information to VCAP
            if (this._utils.hasValue(bvn) && this._utils.hasValue(bvnList[bvn])) {
                let base64String = `data:image/jpg;base64,${bvnList[bvn]}`;
                let file = await this.createDocument("BVN DETAILS.jpg", base64String, customerCode);
                resolve({ status: true, file });
            }
            else {
                resolve({ status: false });
            }
        } catch (err:any) {
            console.log(err)
            resolve({ status: false });
        }
    });
}

export default DocumentService;