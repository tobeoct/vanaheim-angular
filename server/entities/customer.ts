import { Gender } from "@enums/gender";
import { MaritalStatus } from "@enums/maritalstatus";
import { BaseEntity } from "./base-entity";
import { NOK } from "./nok";

export class Customer extends BaseEntity {
  firstName: string;
  otherNames: string;
  lastName: string;
  address: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  maritalStatus: MaritalStatus;
  BVN: string;
  NOK: NOK;
  NOKID: number;
  customerid: string;
  taxId?: string;
  title: string;
  userID: number;

  constructor() {
    super();
    this.generateTemplateData = this.generateData;
  }
  private generateData(): any {
    let title = "Personal Information";

    let rows = [{ label: "Name", value: this.title + " " + this.lastName + " " + this.firstName + " " + this.otherNames },
    { label: "BVN", value: this.BVN },
    { label: "Gender", value: this.gender },
    { label: "Marital Status", value: this.maritalStatus },
    { label: "Tax Identification Number", value: this.taxId },
    {
      label: "Date Of Birth", value: this.dateOfBirth.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).split(' ').join('-')
    },
    { label: "Email", value: this.email },
    { label: "Phone Number", value: this.phoneNumber },
    { label: "Address", value: this.address }]
    return { title, rows };
  }
}