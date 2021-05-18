import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AccountInfo } from 'src/app/modules/loan/personal/account-info/account-info';
import { BVN } from 'src/app/modules/loan/personal/bvn/bvn';
import { EmploymentInfo } from 'src/app/modules/loan/personal/employment-info/employment-info';
import { LoanDetails } from 'src/app/modules/loan/personal/loan-calculator/loan-details';
import { NOKInfo } from 'src/app/modules/loan/personal/nok-info/nok-info';
import { PersonalInfo } from 'src/app/modules/loan/personal/personal-info/personal-info';
@Injectable({
  providedIn: 'root'
})
export class Store{
  states:string[]= ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']
  titles:string[]=["Mr", "Mrs", "Ms"];
  months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  banks:any[]=[
    {code:"044",title:"Access Bank Plc"},
    {code:"023",title:"Citibank Nigeria Limited"},
    {code:"050",title:"Ecobank"},
    {code:"070",title:"Fidelity Bank"},
    {code:"011",title:"First Bank Nigeria"},
    {code:"214",title:"First City Monument Bank"},
    {code:"058",title:"GTB"},
    {code:"030",title:"Heritage Bank"},
    {code:"082",title:"KeyStone Bank"},
    {code:"076",title:"Polaris Bank"},
    {code:"221",title:"Stanbic IBTC Bank"},
    {code:"100",title:"Standard Chartered Bank"},
    {code:"232",title:"Sterling Bank"},
    {code:"100",title:"SunTrust Bank"},
    {code:"032",title:"Union Bank of Nigeria"},
    {code:"033",title:"UBA"},
    {code:"215",title:"Unity Bank"},
    {code:"035",title:"Wema Bank"},
    {code:"057",title:"Zenith Bank"}
  ]
  loanTypes:any[] = [{
    id: 1,
    title: "PayDay Loans",
    requirements: [{title:"Salary account statement", description:" for the last Six (6) months till date"}, {title:"Employment offer / Confirmation Letter", description:" + Current Letter of Introduction (Which can be obtained after the application process)."}, {title:"Work Identity card", description:""}, {title:"Valid Government Issued ID card", description:" (Driver’s License, international passport,National ID card or Voter’s card)."}, {title:"Postdated cheque", description:" issued to the tune of the monthly repayment amount"}]
}, {
    id: 2,
    title: "Business Loans",
    requirements: [{title: "Copy ofbusiness registration documents", description:" from CAC"}, {title:"Business account statement", description:" for the last Six (6) months till date"}, {title:"Personal account statement", description:" for the last six (6) months till date"}, {title:"Business brief or Corporate Profile", description:""}, {title:"Cover letter", description:" providing reason for accessing the loan (Which can be provided as a note in the application form)"}, {title:"Valid means of Identity", description:" (Voter’s card, National ID card, Valid Driver’s License or Valid International passport)"}, {title:"Postdated cheque", description:"s issued to the tune of the monthly repayment amount  (to be provided post the application process)"}]//}, {title:"Remita Direct Debit mandate", description:" (to be provided post the application process)"]
}, {
    id: 3,
    title: "LPO Financing",
    requirements: [{title:"Application letter", description:" on company letterhead"}, {title:"Business registration / incorporation", description:" details and documents"}, {title:"Board resolution for loan request", description:""}, {title:"Valid means of Identity", description:" of two directors (Voter’s card, National ID card, Valid Driver’s License, or Valid International passport)."}, {title:"Business account bank statement", description:" for the last Six (6) months till date."}, {title:"Personal account statement", description:" for two directors for the last six (6) months till date"}, {title:"Postdated cheque", description:" issued to the tune of the monthly repayment amount."}, {title:"Remita Direct Debit mandate", description:" (to be provided post the application process)"}, {title:"Evidence of previously executed contracts", description:" (POs, contract agreements, completion certificates, payment invoices etc.)"}, {title:"Signed MOUs", description:" on current contract"}, {title:"Supplier Invoices on current contract", description:""}, {title:"Terms & Conditions", description:" of contract (Full contract)"}]
}, {
    id: 4,
    title: "Float Loans (Individual)",
    requirements: [{title:"Personal account statement", description:" for the last Six (6) months till date."}, {title:"Employment offer/Confirmation letter.", description:""}, {title:"Work Identity card", description:""}, {title:"Valid ID card", description:" (Driver’s License, international passport, National ID card or Voter’s card)."}, {title:"Postdated cheque", description:" issued to the tune of the monthly repayment amount (to be provided post the application process)"}, {title:"Remita Direct Debit mandate", description:" (to be provided post the application process)"}]
}, {
    id: 5,
    title: "Float Loans (Business)",
    requirements: [{title:"Copy of your business registration documents", description:" from CAC"}, {title:"Business account statement", description:" for the last Six (6) months till date"}, {title:"Personal account statement", description:" for the last six (6) months till date"}, {title:"Valid means of Identity", description:" (Voter’s card, National ID card, Valid Driver’s License or Valid International passport)"}, {title:"Postdated cheque", description:"s issued to the tune of the monthly repayment amount"}, {title:"Cover letter", description:" providing reason for accessing the loan (Which can be provided as a note in the application form)"}, {title:"Remita Direct Debit mandate", description:" (to be provided post the application process)"}]
}, {
    id: 6,
    title: "Personal Line Of Credit",
    requirements: [{title:"Salary account statement", description:" for the last Six (6) months till date"},{title: "Other Personal account statement", description:" for the last six (6) months till date"}, {title:" Employment offer / Confirmation Letter", description:" + Current Letter of Introduction (Which can be obtained after the application process)."}, {title:"Work Identity card", description:""}, {title:"Valid Government Issued ID card", description:" (Driver’s License, international passport,National ID card or Voter’s card)."}, {title:"Postdated cheque", description:" issued to the tune of the monthly repayment amount"}]
}, {
    id: 7,
    title: "Business Line Of Credit",
    requirements: [{title:"Copy of your business registration documents", description:" from CAC"}, {title:"Business brief or Corporate Profile", description:""}, {title:"Cover letter", description:" providing reason for accessing the loan (Which can be provided as a note in the application form)"}, {title:"Business account statement", description:" for the last Six (6) months till date"}, {title:"Personal account statement", description:" for two directors for the last six (6) months till date"}, {title:"Valid means of Identity", description:" for both directors (Voter’s card, National ID card, Valid Driver’s License or Valid International passport)"}, {title:"Postdated cheques", description:" issued to the tune of the monthly repayment amount"}, {title:"Remita Direct Debit mandate", description:" (to be provided post the application process)"}]
}];
  businessSectors:string[]=["Agriculture","Energy and Power","FMCG","Fashion","Financial Services","Haulage / Logistics","Healthcare","ICT (Tech)","Manufacturing","Media & Entertainment","Oil & Gas","Professional Services","Security","Telecommunication","Tourism & Hospitality","Transportation","Waste Management","Other",  ]
  private loanApplicationSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  private loanApplication$:Observable<any> = this.loanApplicationSubject.asObservable();
  
  private pageSubject:BehaviorSubject<string> = new BehaviorSubject<string>('loan-type');
   page$:Observable<string> = this.pageSubject.asObservable();
  
   private  previousSubject:BehaviorSubject<string> = new BehaviorSubject<string>('');
   previous$:Observable<string> = this.previousSubject.asObservable();

   titleSubject:BehaviorSubject<string> = new BehaviorSubject<string>('');
   title$:Observable<string> = this.titleSubject.asObservable();

   private  loanTypeSubject:BehaviorSubject<string> = new BehaviorSubject<string>('');
   loanType$:Observable<string> = this.loanTypeSubject.asObservable();
  
   private applyingAsSubject:BehaviorSubject<string> = new BehaviorSubject<string>('');
   applyingAs$:Observable<string> = this.applyingAsSubject.asObservable();
  
   private  loanProductSubject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  loanProduct$:Observable<string> = this.loanProductSubject.asObservable();
  
  private requirementsSubject:BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private requirements$:Observable<string[]> = this.requirementsSubject.asObservable();
  
  private loanCalculatorSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  private loanCalculator$:Observable<any> = this.loanCalculatorSubject.asObservable();
  
  private bvnSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  private bvn$:Observable<any> = this.bvnSubject.asObservable();
  
  private personalInfoSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  private personalInfo$:Observable<any> = this.personalInfoSubject.asObservable();

  private accountInfoSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private accountInfo$:Observable<any> = this.accountInfoSubject.asObservable();
  
  private employmentInfoSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  private employmentInfo$:Observable<any> = this.employmentInfoSubject.asObservable();

  private nokInfoSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  private nokInfo$:Observable<any> = this.nokInfoSubject.asObservable();

  constructor(private _router:Router){
    this.applyingAsSubject.next(localStorage.getItem("applyingAs")||'');
    this.loanTypeSubject.next(localStorage.getItem("loanType")||'');
    this.loanProductSubject.next(localStorage.getItem("loanProduct")||'');
    this.previousSubject.next(localStorage.getItem("previous")||'');
    this.pageSubject.next(localStorage.getItem("page")||'');
  }
 
  setPrevious(page:string){
    this.previousSubject.next(page);
    localStorage.setItem("previous",page); 
  }
  setPage(page:string){
    this.pageSubject.next(page)
    localStorage.setItem("page",page); 
  }
  get loanType() { return localStorage.getItem("loanType")||''; }
  setLoanType(value:string) { this.loanTypeSubject.next(value); localStorage.setItem('loanType',value); this.setPrevious("loan-type");  this.setPage("applying-as") }

  get applyingAs() { return localStorage.getItem("applyingAs")||''; }
  setApplyingAs(value:string) { this.applyingAsSubject.next(value); localStorage.setItem('applyingAs',value); this.setPrevious("applying-as");this.setPage("loan-product");}
  
  get loanProduct() { return localStorage.getItem("loanProduct")||''; }
  setLoanProduct(value:string) { this.loanProductSubject.next(value); localStorage.setItem('loanProduct',value); this.setPrevious("loan-product");this.setPage("loan-calculator");}
  
  get loanCalculator() { return JSON.parse(localStorage.getItem("loanCalculator")||'{}'); }
  setLoanCalculator(value:LoanDetails) { this.loanCalculatorSubject.next(value); localStorage.setItem('loanCalculator',JSON.stringify(value)); this.setPrevious("loan-calculator");this.setPage("bvn-info");}
  

  get bvn() { return JSON.parse(localStorage.getItem("bvn")||'{}'); }
  setBvn(value:BVN) { this.bvnSubject.next(value); localStorage.setItem('bvn',JSON.stringify(value)); this.setPrevious("bvn-info"); this.setPage("personal-info");}
  
  get personalInfo() { return JSON.parse(localStorage.getItem("personalInfo")||'{}'); }
  setPersonalInfo(value:PersonalInfo) { this.personalInfoSubject.next(value); localStorage.setItem('personalInfo',JSON.stringify(value)); this.setPrevious("personal-info"); this.setPage("account-info");}
  
  get accountInfo() { return JSON.parse(localStorage.getItem("accountInfo")||'[]'); }
  setAccountInfo(value:AccountInfo[]) { this.accountInfoSubject.next(value); localStorage.setItem('accountInfo',JSON.stringify(value)); this.setPrevious("account-info"); this.setPage("employment-info");}
  
  get employmentInfo() { return JSON.parse(localStorage.getItem("employmentInfo")||'{}'); }
  setEmploymentInfo(value:EmploymentInfo) { this.employmentInfoSubject.next(value); localStorage.setItem('employmentInfo',JSON.stringify(value)); this.setPrevious("employment-info"); this.setPage("nok-info");}
  
  get nokInfo() { return JSON.parse(localStorage.getItem("nokInfo")||'{}'); }
  setNOKInfo(value:NOKInfo) { this.nokInfoSubject.next(value); localStorage.setItem('nokInfo',JSON.stringify(value)); this.setPrevious("nok-info"); this.setPage("upload");}
  

  back=()=>{
    let page = "loan-type";
    if(this.applyingAsSubject.value && this.pageSubject.value =="loan-product") page = "applying-as";
    if(this.loanTypeSubject.value  && this.pageSubject.value =="applying-as") page = "loan-type";
    this.pageSubject.next(page);
    // this._router.navigate([".."])
  }
}