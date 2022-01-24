import { Scope } from "@enums/scope";
import { BaseEntity } from "./base-entity";

export class UserRole extends BaseEntity{
    name:string;
    code:string;
    description:string;
    scope:Scope;
    permissions:any[]
}