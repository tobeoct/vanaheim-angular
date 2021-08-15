import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, EMPTY, from, Observable, Subject, Subscription } from 'rxjs';
import { catchError, delay, distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { CompanyInfo } from './company-info';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import moment = require('moment');
import { DateRange } from 'src/app/shared/components/date/date';
@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CompanyInfoComponent implements OnInit {
  form:FormGroup;
  titles:string[];
  states:string[];
  timeInBusinessList:string[];
  natureOfBusinessList:string[];
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  range:DateRange = DateRange.all;
  base:string;

  isLoggedIn:boolean;
  companies:BehaviorSubject<any[]>=new BehaviorSubject<any[]>([]);
  companiesFromDb$:Observable<any[]> = this.companies.asObservable();
  
  dataLoadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  dataLoading$:Observable<boolean> = this.dataLoadingSubject.asObservable();
  
  showFormSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  showForm$:Observable<boolean> = this.showFormSubject.asObservable();
  
  focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  focus$:Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  loading$:Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();

  get companyId(){
    return this.form.get("id") as FormControl|| new FormControl();
  }
  get companyRCNo(){
    return this.form.get("rcNo") as FormControl|| new FormControl();
  }
  get companyName(){
    return this.form.get("companyName") as FormControl|| new FormControl();
  }
  get timeInBusiness(){
    return this.form.get("timeInBusiness") as FormControl|| new FormControl();
  }
  get natureOfBusiness(){
    return this.form.get("natureOfBusiness") as FormControl|| new FormControl();
  }

  get doiGroup(){
    return this.form.get("doiGroup") as FormGroup|| new FormControl();
  }
  get day(){
    return this.form.get("doiGroup.day") as FormControl|| new FormControl();
  }
  get month(){
    return this.form.get("doiGroup.month") as FormControl|| new FormControl();
  }
  get year(){
    return this.form.get("doiGroup.year") as FormControl|| new FormControl();
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


  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store,private _authService:AuthService,private _customerService:CustomerService,
    private _validators:VCValidators, private _route: ActivatedRoute) { 
      this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
        this.base = x.url.replace(/\/[^\/]*$/, '/');
       });
    }
  ngOnInit(): void {
    this.isLoggedIn=this._authService.isLoggedIn();
    if(this.isLoggedIn){
      this.dataLoadingSubject.next(true);
      this.companiesFromDb$ = this._customerService.companies().pipe(map((c:any[])=>{
        this.companies.next(c);
        return c;
      }),take(1),tap(c=>this.dataLoadingSubject.next(false)), catchError(c=>{console.log(c);this.dataLoadingSubject.next(false);return EMPTY}));
      
    }else{
      this.showForm();
    }
    const companyInfo = this._store.companyInfo as CompanyInfo;
    this.form = this._fb.group({
      id:[0],
      companyName: [companyInfo.companyName?companyInfo.companyName:"",[Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
      rcNo: [companyInfo.companyRCNo?companyInfo.companyRCNo:"",[Validators.required,Validators.minLength(3),Validators.maxLength(25)]],
      natureOfBusiness: [companyInfo.natureOfBusiness?companyInfo.natureOfBusiness:""],
      timeInBusiness: [companyInfo.timeInBusiness?companyInfo.timeInBusiness:"",[Validators.required]],
      doiGroup: this._fb.group({
        day: [companyInfo.dateOfIncorporation?.day?companyInfo.dateOfIncorporation.day:1, [Validators.required, Validators.min(1), Validators.max(31)]],
        month: [companyInfo.dateOfIncorporation?.month?companyInfo.dateOfIncorporation.month:'January', [Validators.required]],
        year: [companyInfo.dateOfIncorporation?.year?companyInfo.dateOfIncorporation.year:2002, [Validators.required, Validators.min(1900), Validators.max(2002)]]},
        {}),
        contactGroup: this._fb.group({
          email: [companyInfo.email?companyInfo.email:"",[Validators.required,Validators.email]],
          phone: [companyInfo.phoneNumber?companyInfo.phoneNumber:"",[Validators.required,this._validators.phone]],
          addressGroup: this._fb.group({
            street: [companyInfo.address?.street?companyInfo.address.street:"",[Validators.required]],
            city: [companyInfo.address?.city?companyInfo.address.city:"",[Validators.required]],
            state: [companyInfo.address?.state?companyInfo.address.state:"", [Validators.required]]},
            {})},
          {}),
       
  });
  this.companyId.valueChanges.pipe(distinctUntilChanged()).subscribe(c=>{
    if(c>0){
      let company =this.companies.value.find(e=>e.id==c);
      this.setValue(company);
    }
  })
    this._store.titleSubject.next("Company Information");
    this.titles = this._store.titles;
    this.states = this._store.states;
    this.natureOfBusinessList =this._store.natureOfBusiness;
    this.timeInBusinessList= this._store.timeInBusiness;
  }

  allSubscriptions:Subscription[]=[];
  focus(){
    this.focusSubject.next(true)
  }
  showForm(){
    this.showFormSubject.next(true);
  }

  
patchValue(company:any){
  if(company){
  if(!this.email.value&&company.email){
    this.email.patchValue(company.email);
  }
  if(!this.companyRCNo.value&&company.rcNo){
    this.companyRCNo.patchValue(company.rcNo);
  }
  if(!this.phone.value&&company.phoneNumber){
    this.phone.patchValue(company.phoneNumber);
  }
  if(!this.companyName.value&&company.name){
    this.companyName.patchValue(company.name);
  }
  if(!this.natureOfBusiness.value&&company.natureOfBusiness){
    this.natureOfBusiness.patchValue(company.natureOfBusiness);
  }
  if(!this.timeInBusiness.value &&company.timeInBusiness){
    this.timeInBusiness.patchValue(company.timeInBusiness);
  }
  if(company.address){
    let a = company.address.split(",");
    let street = a[0];
    let city = a[1];
    let state = a[2];
  if(!this.street.value){
    this.street.patchValue(street);
  }
  if(!this.city.value){
    this.city.patchValue(city);
  }
  if(!this.state.value){
    this.state.patchValue(state);
  }
  }
  
if(company.dateOfIncorporation){
  let d = moment(company.dateOfIncorporation);
  let day = d.get("day")?.toString();
  let month = d.get("month")?.toString();
  let year = d.get("year")?.toString();
if(!this.day.value){
  this.day.patchValue(day);
}
if(!this.month.value){
  this.month.patchValue(month);
}
if(!this.year.value){
  this.year.patchValue(year);
}
}
  
  }
  }
  setValue(company:any){
    if(company){
    if(company.email){
      this.email.patchValue(company.email);
    }
    if(company.timeInBusiness){
      this.timeInBusiness.patchValue(company.timeInBusiness);
    }
    if(company.phoneNumber){
      this.phone.patchValue(company.phoneNumber);
    }
    if(company.name){
      this.companyName.patchValue(company.name);
    }
    if(company.natureOfBusiness){
      this.natureOfBusiness.patchValue(company.natureOfBusiness);
    }
    if(company.rcNo){
      this.companyRCNo.patchValue(company.rcNo);
    }
    if(company.address){
      let a = company.address.split(",");
      let street = a[0];
      let city = a[1];
      let state = a[2];
      this.street.patchValue(street);
      this.city.patchValue(city);
      this.state.patchValue(state);
    
    }
    
if(company.dateOfIncorporation){
  let d = moment(company.dateOfIncorporation);
  let day = d.get("day")?.toString();
  let month = d.get("month")?.toString();
  let year = d.get("year")?.toString();
  this.day.patchValue(day);
  this.month.patchValue(month);
  this.year.patchValue(year);
}
    }
    }

ngAfterViewInit(): void {
    const sub = this.delay$.subscribe(c=>{
        this.focus();    
    })
    this.allSubscriptions.push(sub);
}
ngOnDestroy(): void {
  this.allSubscriptions.forEach(sub=>sub.unsubscribe());
}

  onSubmit=(form:FormGroup)=>{
    if(!form.valid) return;
    console.log(this.companyId.value)
    const companyInfo:CompanyInfo ={id:this.companyId.value,timeInBusiness:this.timeInBusiness.value, companyRCNo: this.companyRCNo.value, companyName: this.companyName.value, natureOfBusiness: this.natureOfBusiness.value, email: this.email.value, phoneNumber:this.phone.value, dateOfIncorporation:{day:this.day.value, month: this.month.value, year:this.year.value},address:{street:this.street.value, city:this.city.value, state:this.state.value}};
     this._store.setCompanyInfo(companyInfo);
    this.onNavigate("shareholder-info");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }
}
