import { BaseEntity } from "@models/base-entity";
import { Document } from "@models/document";
import { IdentificationType } from "src/app/modules/earnings/earnings-application";

export class MeansOfIdentification extends BaseEntity {
    Document: Document
    documentID:number;
    type: IdentificationType;
    idNumber: string;
    issueDate?: Date;
    expiryDate?: Date
}