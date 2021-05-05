import { Injectable } from "@angular/core";
import { ValidatorFn, AbstractControl, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { Utility } from "src/shared/helpers/utility.service";
@Injectable({
  providedIn: 'root'
})
export default class VCValidators{

constructor(private _utility:Utility){

}
  numberRange(min:number,max:number):ValidatorFn{
  
    return(c:AbstractControl): {[key:string]:boolean}|null=>{
        let value = this._utility.convertToPlainNumber(c.value);
    if(value!=null && (isNaN(value)||value<min||value>max)) return {'range':true}
    return null;
  }
  }
   matcher(first:string,last:string):ValidatorFn{
  
    return(c:AbstractControl): {[key:string]:boolean}|null=>{
      const firstCtrl = c.get(`${first}`);
      const lastCtrl = c.get(`${last}`);
      if(firstCtrl!=null && lastCtrl!=null){
      if(firstCtrl.pristine || lastCtrl.pristine) return null;
    if(firstCtrl.value===lastCtrl.value)   return null;
      }
    return {'match':true}
  
  }
}
username=(usernameCtrl:AbstractControl): {[key:string]:boolean}|null=>{
    if(usernameCtrl!=null){
    if(usernameCtrl.pristine) return null;
    let res:any = Validators.email(usernameCtrl);
    if(!res) return res;
    if(this._utility.isPhoneNumber(usernameCtrl.value))  return null;
    }
    return {'username':true}

}
phone=(phoneCtrl:AbstractControl): {[key:string]:boolean}|null=>{
  if(phoneCtrl!=null){
  if(phoneCtrl.pristine) return null;
  if(this._utility.isPhoneNumber(phoneCtrl.value))  return null;
  }
  return {'phone':true}

}
password=(passwordCtrl:AbstractControl): {[key:string]:boolean}|null=>{
  var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  if(passwordCtrl!=null){
  if(passwordCtrl.pristine) return null;
  if(mediumRegex.test(passwordCtrl.value))  return null;
  }
  return {'password':true}

}

validationMessages:any = {
  email:(obj:any,key:string)=>{return 'Incorrect email format e.g abc@xyz.com'},
  required:(obj:any,key:string)=>{return "This field is required"},
  phone:(obj:any,key:string)=>{return "Your phone number is invalid"},
  minlength: (obj:any,key:string)=>{return "Minimum length for this field is "+obj[key]?.requiredLength},
  maxlength: (obj:any,key:string)=>{return "Maximum length for this field is "+obj[key]?.requiredLength},
  password:(obj:any,key:string)=>{return "Password is too weak, (six digits or more ,include an upper case letter or a number)"},
  username:(obj:any,key:string)=>{return "Username must be a phone number or email"},
}

setMessage =(errorList:any,errorMessageSubject:Subject<any> )=>{
  return (c:AbstractControl,key:string):void=>{
      console.log(key)
    if(errorList[key]) errorList[key]=undefined;
    // this.errorMessageSubject.next();
    if((c.dirty||c.touched)&&c.errors){
      Object.assign(errorList, {[key]: Object.keys(c.errors).map(key=>{
        if(!this.validationMessages[key]) return undefined;
        return this.validationMessages[key](c.errors,key)
      }).join(' ')});
      // console.log(c.errors)
      errorMessageSubject.next(errorList);
    }
  }
}
}