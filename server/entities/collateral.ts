import { BaseEntity } from "./base-entity";
import { Document } from "./document";


export class Collateral extends BaseEntity {

   type: string;
   description: string;
   valuation: number;
   owner: string;
   documentID: number;
   document: Document;
   customerID: number;
   constructor() {
      super();
      this.generateTemplateData = this.generateData;
   }
   private generateData(): any {
      let title = "Collateral Information";

      let rows = [{ label: "Type", value: this.type },
      { label: "Description", value: this.description },
      { label: "Valuation", value: this.valuation },
      { label: "Owner", value: this.owner },
      { label: "Document", value: this.document?.name || "None" }
      ]
      return { title, rows };
   }
}