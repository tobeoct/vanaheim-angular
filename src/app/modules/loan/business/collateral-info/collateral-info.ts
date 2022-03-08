import { Document } from "../../shared/document-upload/document";

export class CollateralInfo{
    id:number=0;
    type:string;
    description:string;
    valuation:string;
    owner:string;
    document:Document;
    hasDocument:boolean;
}
