import { BaseEntity } from "./base-entity";
import { ContactDetails } from "@models/contact-details";


export class Company extends BaseEntity implements ContactDetails {

   name: string;
   rcNo: string;
   natureOfBusiness: string;
   dateOfIncorporation: Date;
   timeInBusiness: string;
   phoneNumber: string;
   email: string;
   street: string;
   city: string;
   state: string;
   address: string;
   customerID: number;

   constructor() {
      super();
      this.generateTemplateData = this.generateData;
   }
   private generateData(): any {
      let title = "Shareholder Information";

      let rows = [{ label: "Name", value: this.name },
      { label: "RC. No", value: this.rcNo },
      { label: "Nature Of Business", value: this.natureOfBusiness },
      { label: "Date Of Incorporation", value: this.dateOfIncorporation },
      { label: "Time In Business", value: this.timeInBusiness },
      { label: "Email", value: this.email },
      { label: "Phone Number", value: this.phoneNumber },
      { label: "Address", value: this.address },
      ]
      return { title, rows };
   }
}