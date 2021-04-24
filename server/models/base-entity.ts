import { BaseStatus } from "@enums/status";

export class BaseEntity{
    id:number;
    status:BaseStatus;
    isActive:boolean;
    dateUpdated:Date;
    dateCreated:Date;
}