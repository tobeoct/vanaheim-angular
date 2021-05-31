import { Gender } from "@enums/gender";
import { MaritalStatus } from "@enums/maritalstatus";
import { BaseEntity } from "./base-entity";
import { ContactDetails } from "./contact-details";


export class Shareholder extends BaseEntity implements ContactDetails{
   email: string;
   street: string;
   city: string;
   title:string;
   surname:string;
   otherNames:string;
   dateOfBirth:Date;
   gender:Gender;
   maritalStatus:MaritalStatus;
   educationalQualifications:string;
   designation:string;
   phoneNumber:string;
   state:string;
   address:string;
   companyID:number;
   constructor(){
      super();
      this.generateTemplateData = this.generateData;
   }
private generateData():any{
 let title ="Shareholder Information";

 let rows = [{label:"Name",value:this.title+" "+this.surname+" "+this.otherNames},
 {label:"Gender",value:this.gender},
 {label:"Marital Status",value:this.maritalStatus},
 {label:"Educational Qualification",value:this.educationalQualifications},
 {label:"Designation",value:this.designation},
 {label:"Date Of Birth",value:this.dateOfBirth.toLocaleDateString('en-GB', {
   day : 'numeric',
   month : 'short',
   year : 'numeric'
}).split(' ').join('-')},
 {label:"Email",value:this.email},
 {label:"Phone Number",value:this.phoneNumber},
 {label:"Address",value:this.address},
]
  return {title,rows};
}
}