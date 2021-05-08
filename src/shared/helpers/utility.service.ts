import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SideNavigationList, ValidationType } from '../constants/enum';
import { ValidationResponse } from '../constants/variables';
const $browser = ()=>{
  const $window = window;
  const $navigator = navigator;
  return ()=>({navigator:$navigator,window:$window})
}
@Injectable({
  providedIn: 'root'
})
export class Utility{
  activeNavigationSubject:BehaviorSubject<SideNavigationList> = new BehaviorSubject<SideNavigationList>(SideNavigationList.faq);
  activeNavigation$:Observable<SideNavigationList> = this.activeNavigationSubject.asObservable();
  isSideNavOpenedSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isSideNavOpened$:Observable<boolean> = this.isSideNavOpenedSubject.asObservable();
  
  constructor(private _router:Router){
    _router.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((route:any) => {
        if(route.url.includes("loan")){
          this.activeSolutionSubject.next("loan")
        }
        if(route.url.includes('investment')){
          this.activeSolutionSubject.next("investment")
        }

        if(route.url.includes('dashboard')){
          this.activeSolutionSubject.next("dashboard")
        }
        if(route.url.includes('document')){
          this.activeSolutionSubject.next("document")
        }
        if(route.url.includes('account')){
          this.activeSolutionSubject.next("account")
        }
    });
  }
   activeSolutionSubject:BehaviorSubject<string> = new BehaviorSubject<string>("investment");
   activeSolution$:Observable<string> = this.activeSolutionSubject.asObservable();
  
  get $browser() { return $browser()(); }
  get $browserID() { return this.getBrowserID() }
  toggleSideNav=(type:SideNavigationList)=>{
    this.isSideNavOpenedSubject.next(!this.isSideNavOpenedSubject.value);
    if(type!= SideNavigationList.close){
    this.activeNavigationSubject.next(type);
    }
  }
  onNavigate(route:string,params:any={}):void{
    this._router.navigate([route],{queryParams: params})
  }
  RemoveRougeChar=(convertString:any)=>{
    
    if(convertString.toString().substring(0,1) === ","){
        
        return convertString.substring(1, convertString.length)            
        
    }
    return convertString;
    
}
private getBrowserID=()=>{
  let browserID="";
  let Sys:any = {};
  
        let ua = this.$browser.navigator.userAgent.toLowerCase();
        let s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

   
        if (Sys.ie)browserID = 'IE: ' + Sys.ie;
        if (Sys.firefox)browserID = 'Firefox: ' + Sys.firefox;
        if (Sys.chrome)browserID = 'Chrome: ' + Sys.chrome;
        if (Sys.opera)browserID = 'Opera: ' + Sys.opera;
        if (Sys.safari)browserID = 'Safari: ' + Sys.safari;
        return browserID;
}
 validateNumberOnly=(event:any)=>{
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
 replaceAll = (string:any, search:any, replace:any) => {
  return string.split(search).join(replace);
}
 convertToPlainNumber =(num:any)=>{
  const value = parseInt(this.replaceAll(num.toString(),",","").replace('NGN','').trim());
  return value;
}
  pad=(n:any, width:any, z:any)=> {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
   filterInput =(event:any,type:ValidationType, eventType:string='press'): ValidationResponse =>{
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
 currencyFormatter=(num:any,showSign:boolean = false)=>{
  if(!this.hasValue(num)) return num;
  const intNum =parseInt(num.toString().replace(/\D/g,''));
  const val = isNaN(intNum)?"": intNum.toLocaleString();
  //const val = currencyFormatter(num).toString().replace(/[NGN]+/g,"").replace(/[₦]+/g,"").split('.')[0].replace(/\D/g,'');
  // console.log(val)
  return val.trim();
}
 hasValue = (obj:any) => {
   
  if (obj !== ""&&obj !== null && obj !== undefined && obj !== "undefined" && obj !== "null"&&obj !== " ") return true;
  return false;
}

 isPhoneNumber=(value:string):boolean=>{
   if(isNaN(+value))return false; 
    if(!value.includes("+234") && value.length!=11 ) return false;
    if(value.includes("+234")  && value.length!=14) return false;
    return true
 }

}