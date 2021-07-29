import { IDocumentRepository } from "@repository/interface/document/Idocument-repository";
import { Document } from "@models/document";
import { BaseRepository } from "../base-repository";

 export class DocumentRepository extends BaseRepository<Document> implements IDocumentRepository{
  constructor(_db:any){
    super(_db.Document)
  }
   getByLoanRequestId= (loanRequestLogId: number) => {
    return new Promise<any[]>(async (resolve, reject) =>{
      resolve(await this._db.findAll({
        where: {
          loanRequestID: loanRequestLogId.toString()
        },
        order:[["updatedAt","DESC"]]
      }));
    });
    
}
  getByCustomerID= (customerID: number) => {
    return new Promise<any[]>(async (resolve, reject) =>{
      resolve(await this._db.findAll({
        where: {
          customerID: customerID
        },
        order:[["updatedAt","DESC"]]
      }));
    });
    
}
}