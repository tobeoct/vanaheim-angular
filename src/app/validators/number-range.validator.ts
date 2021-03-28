import { ValidatorFn, AbstractControl } from "@angular/forms";
import { Utility } from "src/shared/helpers/utility";

export function numberRange(min:number,max:number):ValidatorFn{
  
    return(c:AbstractControl): {[key:string]:boolean}|null=>{
        let value = new Utility().convertToPlainNumber(c.value);
    if(value!=null && (isNaN(value)||value<min||value>max)) return {'range':true}
    return null;
  }
  }