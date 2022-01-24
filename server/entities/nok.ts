import { Relationship } from "@enums/relationship";
import { BaseEntity } from "./base-entity";
import { Customer } from "./customer";
export class NOK extends BaseEntity {
   phoneNumber: string;
   lastName: string;
   firstName: string;
   otherNames: string;
   email: string;
   dateOfBirth: Date;
   relationship: Relationship;
   title: string;
   address: string;
   customerID: number;
   customer: Customer;
   constructor() {
      super();
      this.generateTemplateData = this.generateData;
   }
   private generateData(): any {
      let title = "Next Of Kin Information";

      let rows = [{ label: "Name", value: this.title + " " + this.lastName + " " + this.otherNames },
      { label: "Relationship", value: this.relationship },
      {
         label: "Date Of Birth", value: this.dateOfBirth.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
         }).split(' ').join('-')
      },
      { label: "Email", value: this.email },
      { label: "Phone Number", value: this.phoneNumber },
         //    {label:"Address",value:this.address}
      ]
      return { title, rows };
   }
}