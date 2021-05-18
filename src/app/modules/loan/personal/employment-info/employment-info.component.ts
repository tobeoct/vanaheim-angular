import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { EmploymentInfo } from './employment-info';
const data:any[] = [
  {title:"PayDay Loans",allowedApplicant:["Salary Earner","Business Owner"],allowedTypes:["Personal Loans", "Float Me - Personal"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Personal Line Of Credit",allowedApplicant:["Salary Earner","Business Owner"],allowedTypes:["Personal Loans", "Float Me - Personal"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"LPO Financing",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business", "LPO Financing"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Business Loans",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Business Line Of Credit",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business"], description:"Spread your loan payment, repay when you get your salary"},
]
@Component({
  selector: 'app-employment-info',
  templateUrl: './employment-info.component.html',
  styleUrls: ['./employment-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class EmploymentInfoComponent implements OnInit {
  form:FormGroup;
  businessSectors:string[];
  states:string[];
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  

  get payDay(){
    return this.form.get("payDay") as FormControl|| new FormControl();
  }
  get netMonthlySalary(){
    return this.form.get("netMonthlyAmount") as FormControl|| new FormControl();
  }
  get businessSector(){
    return this.form.get("businessSector") as FormControl|| new FormControl();
  }
  get employer(){
    return this.form.get("employer") as FormControl|| new FormControl();
  }

  get contactGroup(){
    return this.form.get("contactGroup") as FormGroup|| new FormControl();
  }
  get email(){
    return this.form.get("contactGroup.email") as FormControl|| new FormControl();
  }
  get phone(){
    return this.form.get("contactGroup.phone") as FormControl|| new FormControl();
  }
  get addressGroup(){
    return this.form.get("contactGroup.addressGroup") as FormGroup|| new FormControl();
  }
  get street(){
    return this.form.get("contactGroup.addressGroup.street") as FormControl|| new FormControl();
  }
  get city(){
    return this.form.get("contactGroup.addressGroup.city") as FormControl|| new FormControl();
  }
  get state(){
    return this.form.get("contactGroup.addressGroup.state") as FormControl|| new FormControl();
  }
 base:string;

  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store,
    private _validators:VCValidators, private _route: ActivatedRoute) { this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
     });}
   
  focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  focus$:Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(3000));
  loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  loading$:Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();
  ngOnInit(): void {
    const employmentInfo = this._store.employmentInfo as EmploymentInfo;
    this.form = this._fb.group({
      netMonthlyAmount: [employmentInfo.netMonthlySalary?employmentInfo.netMonthlySalary:"",[Validators.required]],
      employer: [employmentInfo.employer?employmentInfo.employer:"",[Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
      businessSector: [employmentInfo.businessSector?employmentInfo.businessSector:"",[Validators.required]],
     payDay: [employmentInfo.payDay?employmentInfo.payDay:1,[Validators.required]],
    
        contactGroup: this._fb.group({
          email: [employmentInfo.email?employmentInfo.email:"",[Validators.required,Validators.email]],
          phone: [employmentInfo.phoneNumber?employmentInfo.phoneNumber:"",[Validators.required,this._validators.phone]],
          addressGroup: this._fb.group({
            street: [employmentInfo.address?.street?employmentInfo.address.street:"",[Validators.required]],
            city: [employmentInfo.address?.city?employmentInfo.address.city:"",[Validators.required]],
            state: [employmentInfo.address?.state?employmentInfo.address.state:"", [Validators.required]]},
            {validator:Validators.required})},
          {validator:Validators.required}),
       
  });
  
    this._store.titleSubject.next("Employment Information");
    this.businessSectors = this._store.businessSectors;
    this.states = this._store.states;
  }


  onSubmit=(form:FormGroup)=>{
    if(!form.valid) return;
    const employmentInfo:EmploymentInfo ={payDay:this.payDay.value, businessSector: this.businessSector.value, netMonthlySalary: this.netMonthlySalary.value, employer: this.employer.value, email: this.email.value, phoneNumber:this.phone.value,address:{street:this.street.value, city:this.city.value, state:this.state.value}};
     this._store.setEmploymentInfo(employmentInfo);
    this.onNavigate("nok-info");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }
}