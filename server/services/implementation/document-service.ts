
import { BaseService } from "./base-service";
import { IDocumentRepository } from "@repository/interface/document/Idocument-repository";
import { IDocumentService } from "@services/interfaces/Idocument-service";
import { DocumentUpload } from "src/app/modules/loan/shared/document-upload/document";
import { Customer } from "@models/customer";
import mkdirsSync from "@models/helpers/utils/dir";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import UtilService from "./common/util";
import { Document } from "@models/document";
import { BaseStatus } from "@models/helpers/enums/status";
import RedisMiddleware from "server/middleware/redis-middleware";

class DocumentService extends BaseService<any> implements IDocumentService{
 constructor(_documentRepository:IDocumentRepository,private _redis:RedisMiddleware,private fs:any,private fsExtra:any,private _utilService:UtilService, private md5:any){
     super(_documentRepository)
 }
 getByCustomerID= (customerID:number) => new Promise<any>(async (resolve,reject)=>{
    try{
        // const customer = await this._customerRepository.getByUserID(userData.id);
        // let c = customer.dataValues as Customer;
        let repo = this._baseRepository as IDocumentRepository;
        let documents = await repo.getByCustomerID(customerID);
        resolve({status:true,data:documents});
    }catch(err){
        console.log(err.message);
        resolve({status:false, data:err});
    }
 });
 createDocument=(fileName:string,base64String:string,customerCode:string)=> new Promise<any>(async (resolve,reject)=>{
   try{
    let base64 = base64String.split(';base64,').pop();
    let extension =this._utilService.getFileExtension(fileName);
    let name = this.md5(base64)+'.'+extension;
    let filePath = "uploads/"+customerCode+"/"+name;
    if(!this.fsExtra.existsSync("uploads")) mkdirsSync("uploads");
    if(!this.fsExtra.existsSync("uploads/"+customerCode)) mkdirsSync("uploads/"+customerCode);
    if(!this.fsExtra.existsSync(filePath)){
        this.fs.writeFile(filePath, base64, {encoding: 'base64'}, function() {
            console.log('File created');
            resolve({name,extension,path:filePath})
        });
    }else{
        resolve({name,extension,path:filePath})
    }
}catch(err){
    console.log(err);
    reject(err);
}
})
 processDocument=(documentUpload:DocumentUpload,c:Customer)=>new Promise<any>(async(resolve,reject)=>{
     try{
    // const customer = await this._customerRepository.getByUserID(userData.id);
    // let c = customer.dataValues as Customer;
    const base64String = documentUpload.data;
    let file = await this.createDocument(documentUpload.document.fileName,base64String,c.code)
    let repo = this._baseRepository as IDocumentRepository;
    let documentsInDb = await repo.getByCustomerID(c.id) as Document[];
    let documentInDb = documentsInDb.find(doc=>{
        return doc.fileName == file.name && doc.requirement == documentUpload.document.label;
    });
    if(!documentInDb){
        let document = new Document();
        document.fileName = file.name;
        document.name = documentUpload.document.fileName;
        document.status = BaseStatus.Active;
        document.code = this._utilService.autogenerate({prefix:"DOC"});
        document.extension = file.extension;
        document.createdAt = new Date();
        document.url = file.path;
        document.requirement= documentUpload.document.label;
        document.customerID = c.id;
        documentInDb = await repo.create(document);
    }
    resolve({status:true, data:documentInDb});
}catch(err){
    console.log(err.message);
    resolve({status:false, data:"Error uploading document"});
}
 })
getBVNDocument=(bvn:string,customerCode:string)=>new Promise<any>(async (resolve,reject)=>{
    try{
        let bvnList:any = await this._redis.get("bvnList",{});
         //Send bvn information to VCAP
        if(this._utilService.hasValue(bvn)&&this._utilService.hasValue(bvnList[bvn])){
            let base64String =`data:image/jpg;base64,${bvnList[bvn]}`;
            let file= await this.createDocument("BVN DETAILS.jpg",base64String,customerCode);
            resolve({status:true,file});
      }
      else{
        resolve({status:false});
      }
    }catch(err){
        console.log(err)
        resolve({status:false});
    }
});
}

export default DocumentService;