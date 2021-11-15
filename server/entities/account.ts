
import { BaseEntity } from "./base-entity";
import { Customer } from "./customer";

export class Account extends BaseEntity{
    customer:Customer;
    customerID:number;
     bank:string;
     number:string;
    name:string;

    
   constructor(){
    super();
    this.generateTemplateData = this.generateData;
 }
private generateData():any{
let title ="Account Information";

let rows = [{label:"Bank",value:this.bank},{label:"Account Name",value:this.name},
{label:"Account Number",value:this.number},
]
return {title,rows};
}
}