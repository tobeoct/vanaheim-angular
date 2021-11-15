import { Scope } from "server/enums/scope";
import { BaseEntity } from "server/entities/base-entity";

export class UserRole extends BaseEntity{
    name:string;
    code:string;
    description:string;
    scope:Scope;
    permissions:any[]
}