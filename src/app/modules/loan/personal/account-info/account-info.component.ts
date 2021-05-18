import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, Form } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { AccountInfo } from './account-info';
const data:any[] = [
  {title:"PayDay Loans",allowedApplicant:["Salary Earner","Business Owner"],allowedTypes:["Personal Loans", "Float Me - Personal"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Personal Line Of Credit",allowedApplicant:["Salary Earner","Business Owner"],allowedTypes:["Personal Loans", "Float Me - Personal"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"LPO Financing",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business", "LPO Financing"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Business Loans",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Business Line Of Credit",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business"], description:"Spread your loan payment, repay when you get your salary"},
]
@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AccountInfoComponent implements OnInit {
  form:FormGroup;
  titles:string[];
  banks:any[];
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  
    base:string;
  get accountArrayGroups(){
    return this.accountArray.controls as FormGroup[]|| new FormControl();
  }
  get accountArray(){
    return this.form.get("accountArray") as FormArray|| new FormControl();
  }
  get bank(){
    return this.form.get("accountGroup.bank") as FormControl|| new FormControl();
  }
  get accountNumber(){
    return this.form.get("accountGroup.accountNumber") as FormControl|| new FormControl();
  }
  get accountName(){
    return this.form.get("accountGroup.accountName") as FormControl|| new FormControl();
  }

  get pay(){
    return this.form.get("pay") as FormControl|| new FormControl();
  }



  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store,
    private _validators:VCValidators, private _route: ActivatedRoute) {
      this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
        this.base = x.url.replace(/\/[^\/]*$/, '/');
       });
     }

  focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  focus$:Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(3000));
  loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  loading$:Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();
  ngOnInit(): void {
    let accountInfo = this._store.accountInfo as AccountInfo[];
    if(accountInfo.length==0) accountInfo = [new AccountInfo()];
    let account2:AccountInfo= new AccountInfo();
    this.form = this._fb.group({
      
      accountArray:this._fb.array( [...this.buildAccountGroups(accountInfo)]),
      pay: [accountInfo.length>1?null:true],
  });
  if(accountInfo.length>1){
    account2 = accountInfo[1];
  }
    this._store.titleSubject.next("Account Information");
    this.titles = this._store.titles;
    this.banks= this._store.banks;
    this.pay.valueChanges.subscribe(v=>{
        if(v==true||v=='true'){this.accountArray.removeAt(1);}else{
          this.accountArray.push(this.buildAccountGroup(account2));
        }
    });
  }
 clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  buildAccountGroup=(accountInfo:AccountInfo)=>{
    return new FormGroup({
      bank: new FormControl(accountInfo.bank?accountInfo.bank:'', [Validators.required]),
      accountNumber: new FormControl(accountInfo.accountNumber?accountInfo.accountNumber:'', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]),
      accountName:new FormControl( accountInfo.accountName?accountInfo.accountName:'', [Validators.required])
    },{validators:[Validators.required]})
  }
  
  buildAccountGroups=(accountInfos:AccountInfo[]):FormGroup[]=>{
    let groups:FormGroup[] = [];
    for(let i=0;i<accountInfos.length;i++){
      groups.push(this.buildAccountGroup(accountInfos[i]));
    }
    return groups
  }
  onSubmit=(form:FormGroup)=>{
    if(!form.valid) return;
    console.log(form.value);
    const accountInfo:AccountInfo[] = [...form.value["accountArray"]]
    
    // {bank:this.bank.value,accountName:this.accountName.value, accountNumber:this.accountNumber.value};
     this._store.setAccountInfo(accountInfo);
    this.onNavigate("employment-info");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }
}
