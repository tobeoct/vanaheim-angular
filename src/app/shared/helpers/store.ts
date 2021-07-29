import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AccountInfo } from 'src/app/modules/loan/shared/account-info/account-info';
import { BVN } from 'src/app/modules/loan/personal/bvn/bvn';
import { EmploymentInfo } from 'src/app/modules/loan/personal/employment-info/employment-info';
import { LoanDetails } from 'src/app/modules/loan/shared/loan-calculator/loan-details';
import { NOKInfo } from 'src/app/modules/loan/personal/nok-info/nok-info';
import { PersonalInfo } from 'src/app/modules/loan/personal/personal-info/personal-info';
import { AdditionalInfo } from 'src/app/modules/loan/business/additional-info/additional-info';
import { CompanyInfo } from 'src/app/modules/loan/business/company-info/company-info';
import { ShareholderInfo } from 'src/app/modules/loan/business/shareholder-info/shareholder-info';
import { CollateralInfo } from 'src/app/modules/loan/business/collateral-info/collateral-info';
import { BaseLoanApplication } from 'src/app/modules/loan/loan-application';
@Injectable({
  providedIn: 'root'
})
export class Store{
  states:string[]= ['FCT Abuja','Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']
  titles:string[]=["Mr", "Mrs", "Ms"];
  genders:string[]=["Male","Female","Others"];
  maritalStatuses:string[]=["Single","Married","Seperated","Divorced","Others"];
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
timeInBusiness:string[]=[
  "Less than 6 months",
  " 6-12 Months",
  "12- 18 Months",
  "1-2 years",
  "2-5 years",
  "5-10 years",
  " More than 10 years",
  
];
natureOfBusiness:string[]= [
  "Agriculture",
  "Energy and Power",
  "FMCG",
  "Fashion",
  "Financial Services",
  "Haulage / Logistics",
  "Healthcare",
  "ICT (Tech)",
  "Manufacturing",
  "Media & Entertainment",
  "Oil & Gas",
  "Professional Services",
  "Security",
  "Telecommunication",
  "Tourism & Hospitality",
  "Transportation",
  "Waste Management",
  "Other"
]
  businessSectors:string[]=["Agriculture","Energy and Power","FMCG","Fashion","Financial Services","Haulage / Logistics","Healthcare","ICT (Tech)","Manufacturing","Media & Entertainment","Oil & Gas","Professional Services","Security","Telecommunication","Tourism & Hospitality","Transportation","Waste Management","Other",  ]
  designations:string[]=[
    "Chairman",
    "Company Secretary",
    "Executive Director",
    "Non-Executive Director",
    "Others",
  ];
  collateralTypes:string[]=[
    "Fixed Asset (Land)",
      "Fixed Asset (Building)",
      "Fixed Asset (Equipment)",
      "Car",
      "Financial Securities",
      "Others",
  ]
  private loanApplicationSubject:Subject<BaseLoanApplication> = new Subject<BaseLoanApplication>();
  loanApplication$:Observable<BaseLoanApplication> = this.loanApplicationSubject.asObservable();
  
  private pageSubject:BehaviorSubject<string> = new BehaviorSubject<string>('loan-type');
   page$:Observable<string> = this.pageSubject.asObservable();
   
  private loanCategorySubject:BehaviorSubject<string> = new BehaviorSubject<string>('personal');
  loanCategory$:Observable<string> = this.loanCategorySubject.asObservable();
  
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
  
  // Personal
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

  // Business
  private additionalInfoSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  private additionalInfo$:Observable<any> = this.additionalInfoSubject.asObservable();

  private companyInfoSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  private companyInfo$:Observable<any> = this.companyInfoSubject.asObservable();

  private shareholderInfoSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private shareholderInfo$:Observable<any> = this.shareholderInfoSubject.asObservable();

  private collateralInfoSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  private collateralInfo$:Observable<any> = this.collateralInfoSubject.asObservable();

  private documentsSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private documents$:Observable<any[]> = this.documentsSubject.asObservable();
  

  constructor(private _router:Router){
    this.applyingAsSubject.next(this.getFromCurrentApplication("applyingAs")||'');
    this.loanTypeSubject.next(this.getFromCurrentApplication("loanType")||'');
    this.loanProductSubject.next(this.getFromCurrentApplication("loanProduct")||'');
    this.previousSubject.next(this.getItem("previous")||'');
    this.pageSubject.next(this.getItem("page")||'');
    this.loanApplicationSubject.next(this.getLoanApplication());
    this.loanCategorySubject.next(this.getItem("category")||'');
  }
 getItem(key:string){
 return localStorage.getItem(key);
 }
 setItem(key:string,value:any){
  localStorage.setItem(key,value);
 }
 removeItem(key:string){
  localStorage.removeItem(key);
 }
  setPrevious(page:string){
    this.previousSubject.next(page);
    this.setItem("previous",page); 
  }
  setPage(page:string){
    this.pageSubject.next(page)
    this.setItem("page",page); 
  }

  removeApplication(){
    this.removeItem("loan-application");
    this.removeItem("page");
    this.removeItem("category");
    this.removeItem("previous");
  }
  clear(category:string){
    let application = this.getLoanApplication();
    delete application[category];
    this.setItem("loan-application", JSON.stringify(application));
  }
  updateCurrentApplication=(key:string,value:any)=>{
    let application = this.getLoanApplication();
    if(!application[this.loanCategory]) application[this.loanCategory] = {};
    if( typeof value === 'object' || Array.isArray(value)){
      application[this.loanCategory][key] = JSON.stringify(value);
      }else{
        application[this.loanCategory][key] =value;
      }
    this.loanApplicationSubject.next(application);
    this.setItem("loan-application", JSON.stringify(application));
  }
 
  getFromCurrentApplication=(key:string)=>{
    let application = this.getLoanApplication();
    if(application[this.loanCategory]){
      return application[this.loanCategory][key];
    }
    return null;
  }

  get loanApplication() { return this.getLoanApplication()}
  private getLoanApplication=()=>{
    return JSON.parse(this.getItem("loan-application")||'{}');
  
  }
  get loanType() { return this.getFromCurrentApplication("loanType")||''; }
  setLoanType(value:string) { 
    if(value!=this.loanType){console.log("Different"); this.setApplyingAs(''); this.setLoanProduct(''); this.clear(this.loanCategory);}
    
      if(value.toLowerCase().includes("personal")){
        this.setLoanCategory("personal");
      }
      else{
        this.setLoanCategory("business");
      } 
      this.loanTypeSubject.next(value);
      this.updateCurrentApplication('loanType',value);
      this.setPrevious("loan-type");
      this.setPage("applying-as");
      
  }
  get applyingAs() { return this.getFromCurrentApplication("applyingAs")||''; }
  setApplyingAs(value:string) { this.applyingAsSubject.next(value); this.updateCurrentApplication('applyingAs',value); this.setPrevious("applying-as");this.setPage("loan-product");}
  
  get loanProduct() { return this.getFromCurrentApplication("loanProduct")||''; }
  setLoanProduct(value:string) { this.loanProductSubject.next(value); this.updateCurrentApplication('loanProduct',value); this.setPrevious("loan-product");this.setPage("loan-calculator");}
  
  get loanCalculator() { return JSON.parse(this.getFromCurrentApplication("loanCalculator")||'{}'); }
  setLoanCalculator(value:LoanDetails) { this.loanCalculatorSubject.next(value); this.updateCurrentApplication('loanCalculator',JSON.stringify(value)); this.setPrevious("loan-calculator");this.setPage("bvn-info");}
  
// Personal
  get bvn() { return JSON.parse(this.getFromCurrentApplication("bvn")||'{}'); }
  setBvn(value:BVN) { this.bvnSubject.next(value); this.updateCurrentApplication('bvn',JSON.stringify(value)); this.setPrevious("bvn-info"); this.setPage("personal-info");}
  
  get personalInfo() { return JSON.parse(this.getFromCurrentApplication("personalInfo")||'{}'); }
  setPersonalInfo(value:PersonalInfo) { this.personalInfoSubject.next(value); this.updateCurrentApplication('personalInfo',JSON.stringify(value)); this.setPrevious("personal-info"); this.setPage("account-info");}
  
  get accountInfo() { return JSON.parse(this.getFromCurrentApplication("accountInfo")||'[]'); }
  setAccountInfo(value:AccountInfo[]) { this.accountInfoSubject.next(value); this.updateCurrentApplication('accountInfo',JSON.stringify(value)); this.setPrevious("account-info"); this.setPage("employment-info");}
  
  get employmentInfo() { return JSON.parse(this.getFromCurrentApplication("employmentInfo")||'{}'); }
  setEmploymentInfo(value:EmploymentInfo) { this.employmentInfoSubject.next(value); this.updateCurrentApplication('employmentInfo',JSON.stringify(value)); this.setPrevious("employment-info"); this.setPage("nok-info");}
  
  get nokInfo() { return JSON.parse(this.getFromCurrentApplication("nokInfo")||'{}'); }
  setNOKInfo(value:NOKInfo) { this.nokInfoSubject.next(value); this.updateCurrentApplication('nokInfo',JSON.stringify(value)); this.setPrevious("nok-info"); this.setPage("upload");}
  
// Business
get additionalInfo() { return JSON.parse(this.getFromCurrentApplication("additionalInfo")||'{}'); }
  setAdditionalInfo(value:AdditionalInfo) { this.additionalInfoSubject.next(value); this.updateCurrentApplication('additionalInfo',JSON.stringify(value)); this.setPrevious("additional-info"); this.setPage("company-info");}
  
  get companyInfo() { return JSON.parse(this.getFromCurrentApplication("companyInfo")||'{}'); }
  setCompanyInfo(value:CompanyInfo) { this.companyInfoSubject.next(value); this.updateCurrentApplication('companyInfo',JSON.stringify(value)); this.setPrevious("company-info"); this.setPage("shareholder-info");}
  
  get shareholderInfo() { return JSON.parse(this.getFromCurrentApplication("shareholderInfo")||'[]'); }
  setShareholderInfo(value:ShareholderInfo[]) { this.shareholderInfoSubject.next(value); this.updateCurrentApplication('shareholderInfo',JSON.stringify(value)); this.setPrevious("shareholder-info"); this.setPage("collateral-info");}
  
  get collateralInfo() { return JSON.parse(this.getFromCurrentApplication("collateralInfo")||'[]'); }
  setCollateralInfo(value:CollateralInfo) { this.collateralInfoSubject.next(value); this.updateCurrentApplication('collateralInfo',JSON.stringify(value)); this.setPrevious("collateral-info"); this.setPage("account-info");}
  
  get documents() { return JSON.parse(this.getFromCurrentApplication("documents")||'[]'); }
  setDocuments(value:any[]) { this.documentsSubject.next(value); this.updateCurrentApplication('documents',JSON.stringify(value)); this.setPrevious("upload"); this.setPage("preview");}
  
  get loanCategory(){return this.getItem("category")||'';}
  setLoanCategory(value:string){
    this.setItem("category",value);
    this.loanCategorySubject.next(value);
  }

  
  get registerDetails() { 
    let info = this.personalInfo;
    if(info&&Object.keys(info).length>0) return {firstName:info.firstName,surname:info.surname,email:info.email,phoneNumber:info.phoneNumber}
    info = this.additionalInfo;
    if(info&&Object.keys(info).length>0) return {firstName:info.preferredName,email:info.preferredEmail,phoneNumber:info.preferredPhoneNumber}
    return {firstName:null,surname:null,email:null,phoneNumber:null};
  }

  back=()=>{
    let page = "loan-type";
    if(this.applyingAsSubject.value && this.pageSubject.value =="loan-product") page = "applying-as";
    if(this.loanTypeSubject.value  && this.pageSubject.value =="applying-as") page = "loan-type";
    this.pageSubject.next(page);
    // this._router.navigate([".."])
  }
}