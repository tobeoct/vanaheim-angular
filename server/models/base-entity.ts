import { BaseStatus } from "@enums/status";

export class BaseEntity{
    id:number;
    status:BaseStatus;
    isActive:boolean;
    updatedAt:Date;
    createdAt:Date;
    code:string;
}