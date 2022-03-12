
import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import { BaseEntity } from "./base-entity";
import { Customer } from "./customer";

// @ApiModel({
//     description: "Account description",
//     name: "Account"
// })
export class Account extends BaseEntity {

    constructor() {
        super();
        this.generateTemplateData = this.generateData;
    }
    
    customer: Customer;

    customerID: number;

    bank: string;

    number: string;

    name: string;


   
    private generateData(): any {
        let title = "Account Information";

        let rows = [{ label: "Bank", value: this.bank }, { label: "Account Name", value: this.name },
        { label: "Account Number", value: this.number },
        ]
        return { title, rows };
    }
}