import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoanStore, Store } from 'src/app/shared/helpers/store';
const data:any[] = [
  {title:"PayMe Loan",allowedApplicant:["Salary Earner","Business Owner"],allowedTypes:["PayMe Loan", "FloatMe (Personal)"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Personal Line Of Credit",allowedApplicant:["Salary Earner","Business Owner"],allowedTypes:["PayMe Loan", "FloatMe (Personal)"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"LPO Financing",allowedApplicant:["Business Owner", "Corporate", "Vendor/Supplier"],allowedTypes:["FundMe Loan", "FloatMe (Business)", "LPO Finance"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Business Loans",allowedApplicant:["Business Owner", "Corporate", "Vendor/Supplier"],allowedTypes:["FundMe Loan", "FloatMe (Business)"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Business Line Of Credit",allowedApplicant:["Business Owner", "Corporate", "Vendor/Supplier"],allowedTypes:["FundMe Loan", "FloatMe (Business)"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"LPO Financing",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["FundMe Loan", "FloatMe (Business)", "LPO Finance"], description:"Spread your loan payment, repay when you get your salary"},
  
]
@Component({
  selector: 'app-loan-product',
  templateUrl: './loan-product.component.html',
  styleUrls: ['./loan-product.component.scss'],
})
export class LoanProductComponent implements OnInit {
   loanType:string;
   applyingAs:string;
  form:FormGroup;
  base:string;
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._loanStore.loanProduct);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();

  showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$:Observable<boolean> = this.showSubject.asObservable();

  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  
  requirementsSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  requirements$:Observable<any[]> = this.requirementsSubject.asObservable();
  get loanProduct(){
    return this.form.get("loanProduct") as FormControl|| new FormControl();
  }

  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store,private _loanStore:LoanStore, private _route:ActivatedRoute) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url;//.replace(/\/[^\/]*$/, '/');
     });
   }

  ngOnInit(): void {
    this.loanType = this._loanStore.loanType;
    this._loanStore.titleSubject.next("Loan Product");
    this.applyingAs = this._loanStore.applyingAs;
    this.requirementsSubject.next(this._loanStore.loanTypes.find(type=>type.title==this._loanStore.loanProduct)?.requirements || []);
    this.form = this._fb.group({
      loanProduct: [this._loanStore.loanProduct?this._loanStore.loanProduct:"",[Validators.required]],
      
    })
    let d = data.filter(d=>d.allowedTypes.includes(this.loanType)&&d.allowedApplicant.includes(this.applyingAs));
    this.dataSelectionSubject.next(d);
  }

  activate=(id:string)=>{
    this.activeTabSubject.next(id);
    this.loanProduct.patchValue(id);
  }

  next=(event:any)=>{
    this._loanStore.setLoanProduct(this.loanProduct.value);
    // if(this._router.url!="/welcome/loans"){
      let url = "loans/apply/loan-calculator";
      if(this._router.url.includes("apply")) url = "loan-calculator";
      // alert(url)
      this.onNavigate(url);
    // }
  }
  onNavigate(route:string,params:any={}):void{
    // const r =this.base+route;
    this._router.navigate([route],{queryParams: params, relativeTo:this._route.parent})
  }
toggle(product:any){
  this.requirementsSubject.next(this._loanStore.loanTypes.find(type=>type.title==product)?.requirements || []);
  this.showSubject.next(true);
}
close=()=>{
  if(this.requirementsSubject.value){
  this.showSubject.next(false);
  this.requirementsSubject.next([])
  }
}
}
