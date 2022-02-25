import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoanStore, Store } from 'src/app/shared/helpers/store';
const data: any[] = [
  { title: "Salary Earner", allowedTypes: ["PayMe Loan", "FloatMe Loan (Individual)"], description: "A person who earns a fixed regular income made by an employer monthly." },
  { title: "Business Owner", allowedTypes: ["PayMe Loan"], description: "A person who manages a registered and functional business or organization and earns an income regularly from the business." },
  { title: "Business/SME", allowedTypes: ["FundMe Loan", "FloatMe Loan (Business)"], description: "A registered business that is operational and generates revenue." },
  { title: "Corporate Organisation", allowedTypes: ["FundMe Loan", "FloatMe Loan (Business)", "LPO Finance"], description: "A registered corporate organization that is operational and generates revenue." },
  { title: "Contractor/Vendor/Supplier", allowedTypes: ["LPO Finance"], description: "A person, group of persons and/or an organization who has a verified Purchase Order (PO) to execute." },
  { title: "Personal Line Of Credit", allowedTypes: ["Line Of Credit"], description: "Get access to personal loans and withdraw by instalment as needed and repay as agreed." },
  { title: "Business Line Of Credit", allowedTypes: ["Line Of Credit"], description: "Get access to business loans and withdraw by instalment as needed and repay as agreed." },
]
@Component({
  selector: 'app-applying-as',
  templateUrl: './applying-as.component.html',
  styleUrls: ['./applying-as.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplyingAsComponent implements OnInit {
  loanProduct: string;
  form: FormGroup;
  base: string;
  activeTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._loanStore.applyingAs);
  activeTab$: Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();

  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();

  requirementsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  requirements$: Observable<any[]> = this.requirementsSubject.asObservable();
  get applyingAs() {
    return this.form.get("applyingAs") as FormControl || new FormControl();
  }

  constructor(private _router: Router, private _fb: FormBuilder, private _store: Store, private _loanStore:LoanStore, private _route: ActivatedRoute) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
    });
  }

  ngOnInit(): void {
    this.loanProduct = this._loanStore.loanType;
    this._loanStore.titleSubject.next("Applying As");

    this.form = this._fb.group({
      applyingAs: [!this._loanStore.applyingAs ? "" : this._loanStore.applyingAs, [Validators.required]],

    })
    let loanTypes: any = this._loanStore.loanTypes.find(type => type.title == this.loanProduct);
    if (loanTypes) {
      this.requirementsSubject.next(loanTypes?.applyingAs?.find((type: any) => type.title == this.applyingAs.value)?.requirements || []);
    }
    let d = data.filter(d => d.allowedTypes.includes(this.loanProduct));
    this.dataSelectionSubject.next(d);

  }

  activate = (id: string) => {
    this.activeTabSubject.next(id);
    this.applyingAs.patchValue(id);
    // this.next();
    this.toggle(this.applyingAs.value)
  }
  toggle(product: any) {
    let loanTypes: any = this._loanStore.loanTypes.find(type => type.title == this.loanProduct);
    this.requirementsSubject.next(loanTypes?.applyingAs?.find((type: any) => type.title == this.applyingAs.value)?.requirements || []);
    // this.requirementsSubject.next(this._store.loanTypes.find(type=>type.title==product)?.requirements || []);
    this.showSubject.next(true);
  }
  next = () => {

    if (this.applyingAs.value.includes("Line Of Credit")) {
      this._loanStore.setLoanType("Line Of Credit");
    }
    if(this.applyingAs.value=="Personal Line Of Credit"){
      this._loanStore.setLoanCategory("personal");
    }
    if(this.applyingAs.value=="Business Line Of Credit"){
      this._loanStore.setLoanCategory("business");
    }
    
    this._loanStore.setApplyingAs(this.applyingAs.value);
    this._loanStore.setLoanProduct(this.applyingAs.value);
    // if(this._router.url!="/welcome/loans"){
    let url = "loans/apply/loan-calculator";
    if (this._router.url.includes("apply")) url = "loan-calculator";
    // alert(url)
    this.onNavigate(url);
    // if(this._router.url!="/welcome/loans"){
    //   this.onNavigate("loan-product");
    // }
    //  this.onNavigate("welcome/loans/apply/applying-as");
  }
  // onNavigate(route:string,params:any={}):void{
  //   const r =this.base+route;
  //   this._router.navigate([r],{queryParams: params})
  // }
  onNavigate(route: string, params: any = {}): void {
    // const r =this.base+route;
    this._router.navigate([route], { queryParams: params, relativeTo: this._route.parent })
  }
  close = () => {
    if (this.requirementsSubject.value) {
      this.showSubject.next(false);
      this.requirementsSubject.next([])
    }
  }
}
