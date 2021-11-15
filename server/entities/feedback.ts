
import { BaseEntity } from "./base-entity";
import { Customer } from "./customer";


export class Feedback extends BaseEntity{
   customer!:Customer
   message:string

}