import { IDocumentRepository } from "@repository/interface/document/Idocument-repository";
import { Document } from "@models/document";
import { BaseRepository } from "../base-repository";
import { IDocumentRequirementRepository } from "@repository/interface/document/Idocument-req-repository";


 export class DocumentRepository extends BaseRepository<Document> implements IDocumentRepository{
  //  constructor(private _docReqRepository:IDocumentRequirementRepository){
  //    super();
  //  }
  super(){}
}