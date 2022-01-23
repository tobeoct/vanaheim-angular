import { BaseStatus } from "@enums/status";
export interface IBaseEntity{
    id:number;
    status:BaseStatus;
    // isActive:boolean;
    updatedAt:Date;
    createdAt:Date;
    code:string;
    generateTemplateData:()=>any
 
}
export class BaseEntity implements IBaseEntity{
    generateTemplateData: () => any;
    id:number;
    status:BaseStatus;
    // isActive:boolean;
    updatedAt:Date;
    createdAt:Date;
    code:string;
    
 
}