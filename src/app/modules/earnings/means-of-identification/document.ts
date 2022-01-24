export class Document{
    id:number=0;
    fileName:string;
    label:string;
} 

export class DocumentUpload{
    document:Document;
    data:any;
    uploaded:boolean;
    savedName:string;
}