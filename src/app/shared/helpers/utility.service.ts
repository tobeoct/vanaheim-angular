import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SideNavigationList, ValidationType } from '../constants/enum';
import { ValidationResponse } from '../constants/variables';
const $browser = () => {
  const $window = window;
  const $navigator = navigator;
  return () => ({ navigator: $navigator, window: $window })
}
@Injectable({
  providedIn: 'root'
})
export class Utility {
  dashboardHeadingToggleSubject: BehaviorSubject<string> = new BehaviorSubject<string>("Loans");
  activeNavigationSubject: BehaviorSubject<SideNavigationList> = new BehaviorSubject<SideNavigationList>(SideNavigationList.faq);
  activeNavigation$: Observable<SideNavigationList> = this.activeNavigationSubject.asObservable();
  isSideNavOpenedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isSideNavOpened$: Observable<boolean> = this.isSideNavOpenedSubject.asObservable();
  showLoanInvalidSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  apiSuccessSubject: Subject<string> = new Subject<string>();

  apiErrorSubject: Subject<string> = new Subject<string>();
  apiInfoSubject: Subject<string> = new Subject<string>();

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private _router: Router) {
    _router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((route: any) => {
        if (route.url.includes("loan")) {
          this.activeSolutionSubject.next("loan")
        }
        if (route.url.includes('investment')) {
          this.activeSolutionSubject.next("investment")
        }

        if (route.url.includes('dashboard')) {
          this.activeSolutionSubject.next("dashboard")
        }
        if (route.url.includes('document')) {
          this.activeSolutionSubject.next("document")
        }
        if (route.url.includes('account')) {
          this.activeSolutionSubject.next("account")
        }
        if (route.url.includes('profile')) {
          this.activeSolutionSubject.next("profile")
        }
        if (route.url.includes('loan-calculator')) {
          this.activeSolutionSubject.next("loan-calculator")
        }
      });
  }
  activeSolutionSubject: BehaviorSubject<string> = new BehaviorSubject<string>("dashboard");
  activeSolution$: Observable<string> = this.activeSolutionSubject.asObservable();

  get $browser() { return $browser()(); }
  get $browserID() { return this.getBrowserID() }

  toggleDashbooardHeading(heading: string) {
    this.dashboardHeadingToggleSubject.next(heading);
  }
  toggleSideNav = (type: SideNavigationList) => {
    // if(type!=this.activeNavigationSubject.value){
    // this.isSideNavOpenedSubject.next(!this.isSideNavOpenedSubject.value);
    // }
    if (type != SideNavigationList.close) {
      this.isSideNavOpenedSubject.next(true);
      this.activeNavigationSubject.next(type);
    } else {

      this.isSideNavOpenedSubject.next(false);
    }
  }
  toggleLoading(value: boolean) {
    this.loadingSubject.next(value);
  }
  toggleLoanInvalid() {
    this.showLoanInvalidSubject.next(!this.showLoanInvalidSubject.value);
  }
  showLoanInvalid(status: boolean,url:string) {
    if(!url.includes("apply")||!status)this.showLoanInvalidSubject.next(status);
  }
  setError(message: string) {
    setTimeout(() => { this.apiErrorSubject.next(message); }, 1000)
    setTimeout(() => { this.toggleLoading(false); this.apiErrorSubject.next(""); }, 5000)
  }
  setSuccess(message: string) {
    setTimeout(() => { this.apiSuccessSubject.next(message); }, 1000)
    setTimeout(() => { this.toggleLoading(false); this.apiSuccessSubject.next("") }, 5000)
  }
  setInfo(message: string) {
    setTimeout(() => { this.apiInfoSubject.next(message); }, 0)
    setTimeout(() => { this.toggleLoading(false); this.apiInfoSubject.next("") }, 5000)
  }
  onNavigate(route: string, params: any = {}): void {
    this._router.navigate([route], { queryParams: params })
  }
  RemoveRougeChar = (convertString: any) => {

    if (convertString.toString().substring(0, 1) === ",") {

      return convertString.substring(1, convertString.length)

    }
    return convertString;

  }
  copyToClipboard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  getFileExtension = (filename: string) => {
    let ext = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    return ext;//filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);//filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename
  }
  private getBrowserID = () => {
    let browserID = "";
    let Sys: any = {};

    let ua = this.$browser.navigator.userAgent.toLowerCase();
    let s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
      (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
          (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;


    if (Sys.ie) browserID = 'IE: ' + Sys.ie;
    if (Sys.firefox) browserID = 'Firefox: ' + Sys.firefox;
    if (Sys.chrome) browserID = 'Chrome: ' + Sys.chrome;
    if (Sys.opera) browserID = 'Opera: ' + Sys.opera;
    if (Sys.safari) browserID = 'Safari: ' + Sys.safari;
    return browserID;
  }
  validateNumberOnly = (event: any) => {
    if (event.which >= 37 && event.which <= 40) {
      event.preventDefault();
    }
    let value = event.target.value;
    let num = value.replace(/,/gi, "").split("").reverse().join("").trim();

    let num2 = this.RemoveRougeChar(num.replace(/(.{3})/g, "$1,").split("").reverse().join(""));
    let val = isNaN(this.convertToPlainNumber(num2)) ? '' : this.RemoveRougeChar(num2);
    // the following line has been simplified. Revision history contains original.
    value = val;
    // console.log(event)
  }
  replaceAll = (string: any, search: any, replace: any) => {
    return string.split(search).join(replace);
  }
  convertToPlainNumber = (num: any) => {
    const value = parseInt(this.replaceAll(num.toString(), ",", "").replace('NGN', '').trim());
    return value;
  }
  pad = (n: any, width: any, z: any) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  filterInput = (event: any, type: ValidationType, eventType: string = 'press'): ValidationResponse => {
    let isNumeric: boolean;
    let modifiers: boolean;
    let response: ValidationResponse = new ValidationResponse;
    let keyCode = ('which' in event) ? event.which : event.keyCode;
    isNumeric = (keyCode >= 48 /* KeyboardEvent.DOM_VK_0 */ && keyCode <= 57 /* KeyboardEvent.DOM_VK_9 */)
    // ||(keyCode >= 96 /* KeyboardEvent.DOM_VK_NUMPAD0 */ && keyCode <= 105 /* KeyboardEvent.DOM_VK_NUMPAD9 */);
    modifiers = (event.altKey || event.ctrlKey || event.shiftKey || keyCode == 9 || keyCode == 8)
    // (keyCode>=37 && keyCode<=40));'
    response.value = event.target.value;
    let maxLength = eventType === "press" ? 9 : 10;
    switch (type) {
      case ValidationType.number:
        response.isValid = isNumeric || modifiers;
        response.isValid = response.value.length > maxLength ? false : true;

        break;
      case ValidationType.currency:
        if (isNumeric === false) {
          isNumeric = (keyCode === 188 || keyCode == 44) ? true : false;
        }
        response.value = this.currencyFormatter(event.target.value);
        response.isValid = isNumeric || modifiers;
        response.isValid = response.value.length > maxLength ? false : true;

        break
      // case ValidationType.name:
      // console.log(response.value)
      // var regex = /^[A-Za-z]+$/;
      // response.isValid = regex.test(event.target.value);
      // break;
      default:
        response.isValid = true;
        break;
    }
    return response;

  }
  currencyFormatter = (num: any, showSign: boolean = false) => {
    if (!this.hasValue(num)) return num;
    const intNum = parseInt(num.toString().replace(/\D/g, ''));
    const val = isNaN(intNum) ? "" : intNum.toLocaleString();
    //const val = currencyFormatter(num).toString().replace(/[NGN]+/g,"").replace(/[₦]+/g,"").split('.')[0].replace(/\D/g,'');
    // console.log(val)
    return val.trim();
  }

  formatCurrency = (value: number) => {
    // Create our number formatter.
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    formatter.format(value);
  }
  hasValue = (obj: any) => {

    if (obj !== "" && obj !== null && obj !== undefined && obj !== "undefined" && obj !== "null" && obj !== " ") return true;
    return false;
  }

  isPhoneNumber = (value: string): boolean => {
    if (isNaN(+value)) return false;
    if (!value.includes("+234") && value.length != 11) return false;
    if (value.includes("+234") && value.length != 14) return false;
    return true
  }

}