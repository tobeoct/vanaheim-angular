import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { BVN } from './bvn';
const data:any[] = [
  {title:"PayDay Loans",allowedApplicant:["Salary Earner","Business Owner"],allowedTypes:["Personal Loans", "Float Me - Personal"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Personal Line Of Credit",allowedApplicant:["Salary Earner","Business Owner"],allowedTypes:["Personal Loans", "Float Me - Personal"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"LPO Financing",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business", "LPO Financing"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Business Loans",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Business Line Of Credit",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business"], description:"Spread your loan payment, repay when you get your salary"},
]
@Component({
  selector: 'app-bvn',
  templateUrl: './bvn.component.html',
  styleUrls: ['./bvn.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BVNComponent implements OnInit {
   lType:string;
   applyingAs:string;
   loanProduct:string;
  form:FormGroup;
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  
  get privacy(){
    return this.form.get("privacy") as FormControl|| new FormControl();
  }

  get tc(){
    return this.form.get("tc") as FormControl|| new FormControl();
  }
  get bvn(){
    return this.form.get("bvn") as FormControl|| new FormControl();
  }

    base:string;
  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store,
    private _validators:VCValidators, private _route: ActivatedRoute) {
      this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
        this.base = x.url.replace(/\/[^\/]*$/, '/');
       });
     }

  minAmount:number=25000;
  maxAmount:number=1000000;
  minTenure:number=1;
  maxTenure:number=12;
  tenureDenominator:string = "Mos";
  focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  focus$:Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(3000));
  loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  loading$:Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();
  ngOnInit(): void {
    this.lType = this._store.loanType;
    this.applyingAs = this._store.applyingAs;
    this.loanProduct = this._store.loanProduct;
    const bvn = this._store.bvn as BVN;
    this.form = this._fb.group({
      bvn: [bvn.bvn?bvn.bvn:"",[Validators.required,Validators.minLength(11),Validators.maxLength(11)]],
      tc: [bvn.tc?bvn.tc:"",[Validators.required]],
      privacy: [bvn.privacy?bvn.privacy:"",[Validators.required]]
  });
    let d = data.filter(d=>d.allowedTypes.includes(this.lType)&&d.allowedApplicant.includes(this.applyingAs));
    this.dataSelectionSubject.next(d);
    this._store.titleSubject.next("BVN Verification");
  }


  onSubmit=(event:any)=>{
     this._store.setBvn({bvn:this.bvn.value,tc:this.tc.value,privacy:this.privacy.value});
    this.onNavigate("personal-info");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }
}
