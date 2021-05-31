
import { TemplateService } from "@services/implementation/common/template-service";
import { BaseEntity } from "./base-entity";
import { ContactDetails } from "./contact-details";


export class Employment extends BaseEntity implements ContactDetails{

   email: string;
   street: string;
   city: string;
   employer:string;
   businessSector:string;
   netMonthlySalary:string;
   payDay:number;
   phoneNumber:string;
   state:string;
   address:string;
   customerID:number;
   constructor(){
      super();
      this.generateTemplateData = this.generateData;
   }
private generateData():any{
 let title ="Employment Information";

 let rows = [{label:"Employer",value:this.employer},
 {label:"Business Sector",value:this.businessSector},
 {label:"Email",value:this.email},
 {label:"Phone Number",value:this.phoneNumber},
 {label:"Address",value:this.street+", "+this.city+", "+this.state},
 {label:"Monthly Salary",value:this.netMonthlySalary},
 {label:"Pay Day",value:this.payDay.toString()}]
  return {title,rows};
}

}