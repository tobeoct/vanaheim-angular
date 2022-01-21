import { BaseEntity } from "@models/base-entity";

export class EarningsEmployment extends BaseEntity {

    email: string;
    street: string;
    city: string;
    currentEmployer: string;
    previousEmployer: string;
    businessSector: string;
    phoneNumber: string;
    state: string;
    address: string;
    customerID: number;
    constructor() {
        super();
        this.generateTemplateData = this.generateData;
    }
    private generateData(): any {
        let title = "Employment Information";

        let rows = [{ label: "Current Employer", value: this.currentEmployer },
        { label: "Previous Employer", value: this.previousEmployer },
        { label: "Business Sector", value: this.businessSector },
        { label: "Email", value: this.email },
        { label: "Phone Number", value: this.phoneNumber },
        { label: "Address", value: this.street + ", " + this.city + ", " + this.state },]
        return { title, rows };
    }

}