import { ValidationType } from '../constants/enum';
import { ValidationResponse } from '../constants/variables';

export class Utility{
 public RemoveRougeChar=(convertString:any)=>{
    
    if(convertString.toString().substring(0,1) === ","){
        
        return convertString.substring(1, convertString.length)            
        
    }
    return convertString;
    
}

public validateNumberOnly=(event:any)=>{
  if(event.which >= 37 && event.which <= 40){
    event.preventDefault();
}
let value = event.target.value;
let num = value.replace(/,/gi, "").split("").reverse().join("").trim();

let num2 =this.RemoveRougeChar(num.replace(/(.{3})/g,"$1,").split("").reverse().join(""));
let val =isNaN(this.convertToPlainNumber(num2) )?'': this.RemoveRougeChar(num2);
// the following line has been simplified. Revision history contains original.
value =val;
// console.log(event)
}
public replaceAll = (string:any, search:any, replace:any) => {
  return string.split(search).join(replace);
}
public convertToPlainNumber =(num:any)=>{
  const value = parseInt(this.replaceAll(num.toString(),",","").replace('NGN','').trim());
  return value;
}
public  pad=(n:any, width:any, z:any)=> {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  public filterInput =(event:any,type:ValidationType, eventType:string='press'): ValidationResponse =>{
    let isNumeric:boolean;
    let modifiers:boolean;
    let response: ValidationResponse = new ValidationResponse;
    let keyCode = ('which' in event) ? event.which : event.keyCode;
    isNumeric = (keyCode >= 48 /* KeyboardEvent.DOM_VK_0 */ && keyCode <= 57 /* KeyboardEvent.DOM_VK_9 */) 
    // ||(keyCode >= 96 /* KeyboardEvent.DOM_VK_NUMPAD0 */ && keyCode <= 105 /* KeyboardEvent.DOM_VK_NUMPAD9 */);
    modifiers = (event.altKey || event.ctrlKey || event.shiftKey || keyCode==9|| keyCode==8 )
      // (keyCode>=37 && keyCode<=40));'
      response.value = event.target.value;
      let maxLength = eventType==="press"?9:10;
    switch(type){
      case ValidationType.number:
        response.isValid = isNumeric|| modifiers;
        response.isValid = response.value.length>maxLength?false:true;
        
        break;
      case ValidationType.currency:
        if(isNumeric===false){
              isNumeric = (keyCode===188|| keyCode==44)?true:false;
        }
        response.value =this.currencyFormatter(event.target.value);
        response.isValid = isNumeric|| modifiers;
        response.isValid = response.value.length>maxLength?false:true;
        
        break 
      // case ValidationType.name:
        // console.log(response.value)
        // var regex = /^[A-Za-z]+$/;
        // response.isValid = regex.test(event.target.value);
        // break;
    default:
      response.isValid= true;
      break;
  }
  return response;

}
public currencyFormatter=(num:any,showSign:boolean = false)=>{
  if(!this.hasValue(num)) return num;
  const intNum =parseInt(num.toString().replace(/\D/g,''));
  const val = isNaN(intNum)?"": intNum.toLocaleString();
  //const val = currencyFormatter(num).toString().replace(/[NGN]+/g,"").replace(/[₦]+/g,"").split('.')[0].replace(/\D/g,'');
  // console.log(val)
  return val.trim();
}
public hasValue = (obj:any) => {
   
  if (obj !== ""&&obj !== null && obj !== undefined && obj !== "undefined" && obj !== "null"&&obj !== " ") return true;
  return false;
}

}