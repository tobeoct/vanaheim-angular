import { IDocumentRequirementRepository } from "@repository/interface/document/Idocument-req-repository";
import { DocumentRequirement } from "@models/document-requirement";
import { BaseRepository } from "../base-repository";


 export class DocumentRequirementRepository extends BaseRepository<DocumentRequirement> implements IDocumentRequirementRepository{
   
}