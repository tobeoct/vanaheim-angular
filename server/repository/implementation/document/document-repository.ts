import { IDocumentRepository } from "@repository/interface/document/Idocument-repository";
import { Document } from "@models/document";
import { BaseRepository } from "../base-repository";

 export class DocumentRepository extends BaseRepository<Document> implements IDocumentRepository{
  constructor(_db:any){
    super(_db.Document)
  }
   getByLoanRequestId= (loanRequestId: number) => {
    return new Promise<any[]>(async (resolve, reject) =>{
      resolve(await this._db.findAll({
        where: {
          loanRequestID: loanRequestId?.toString()
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