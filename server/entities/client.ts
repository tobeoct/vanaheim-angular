import { BaseEntity } from "./base-entity";

export class Client extends BaseEntity{
    apiKey:string;
    name:string;
    code:string;
}