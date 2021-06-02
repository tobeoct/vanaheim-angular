import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { ShareholderInfo } from './shareholder-info';
import { EmploymentInfo } from '../../personal/employment-info/employment-info';
import { Address } from 'src/app/shared/interfaces/address';
import { DOB } from 'src/app/shared/interfaces/dob';
const data:any[] = [
  {title:"PayDay Loans",allowedApplicant:["Salary Earner","Business Owner"],allowedTypes:["Personal Loans", "Float Me - Personal"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Personal Line Of Credit",allowedApplicant:["Salary Earner","Business Owner"],allowedTypes:["Personal Loans", "Float Me - Personal"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"LPO Financing",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business", "LPO Financing"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Business Loans",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business"], description:"Spread your loan payment, repay when you get your salary"},
  {title:"Business Line Of Credit",allowedApplicant:["Business Owner", "Corporate", "Contractor"],allowedTypes:["Business Loans", "Float Me - Business"], description:"Spread your loan payment, repay when you get your salary"},
]
@Component({
  selector: 'app-shareholder-info',
  templateUrl: './shareholder-info.component.html',
  styleUrls: ['./shareholder-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ShareholderInfoComponent implements OnInit {
  form:FormGroup;
  businessSectors:string[];
  states:string[];
  months:string[];
  titles:string[];
  genders:string[];
  maritalStatuses:string[];
  designations:string[];
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  

  get shareholderArrayGroups(){
    return this.shareholderArray.controls as FormGroup[]|| new FormControl();
  }
  get shareholderArray(){
    return this.form.get("shareholderArray") as FormArray|| new FormControl();
  }
 base:string;

  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store,
    private _validators:VCValidators, private _route: ActivatedRoute) { this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
     });}
   
  focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  focus$:Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  loading$:Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();
  ngOnInit(): void {
    let shareholderInfos= this._store.shareholderInfo as ShareholderInfo[];
    if(shareholderInfos.length==0) shareholderInfos = [new ShareholderInfo()];
    // let shareholder2:ShareholderInfo= new ShareholderInfo();
    this.form = this._fb.group({
      
      shareholderArray:this._fb.array( [...this.buildShareholderGroups(shareholderInfos)]),
      pay: [shareholderInfos.length>1?null:true],
  });
  // if(shareholderInfos.length>1){
  //   shareholder2 = shareholderInfos[1];
  // }
  
    this._store.titleSubject.next("Shareholder Information");
    this.businessSectors = this._store.businessSectors;
    this.states = this._store.states;
    this.months =this._store.months;
    this.titles = this._store.titles;
    this.genders = this._store.genders;
    this.maritalStatuses = this._store.maritalStatuses;
    this.designations = this._store.designations;
  }

  allSubscriptions:Subscription[]=[];
  focus(){
    this.focusSubject.next(true)
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  removeFromFormArray=(index:number)=>{
    this.shareholderArray.removeAt(index);
  }
  buildShareholderGroup=(shareholder:ShareholderInfo)=>{
    
    let year = new Date().getFullYear();
    let max = year-18;
    return new FormGroup({
      title: new FormControl(shareholder.title?shareholder.title:'', [Validators.required]),
      surname:new FormControl( shareholder.surname?shareholder.surname:'', [Validators.required]),
      otherNames:new FormControl( shareholder.otherNames?shareholder.otherNames:'', [Validators.required]),
      gender:new FormControl( shareholder.gender?shareholder.gender:'', [Validators.required]),
      maritalStatus:new FormControl( shareholder.maritalStatus?shareholder.maritalStatus:'', [Validators.required]),
      designation:new FormControl( shareholder.designation?shareholder.designation:'', [Validators.required]),
      educationalQualification:new FormControl( shareholder.educationalQualification?shareholder.educationalQualification:'', [Validators.required]),
    dobGroup:new FormGroup({
        day: new FormControl( shareholder.dob?.day?shareholder.dob.day:1, [Validators.required, Validators.min(1), Validators.max(31)]),
        month:new FormControl(shareholder.dob?.month?shareholder.dob.month:'January', [Validators.required]),
        year:new FormControl(shareholder.dob?.year?shareholder.dob.year:max, [Validators.required, Validators.min(1900), Validators.max(2002)])
      },
        {}),
        contactGroup: this._fb.group({
          email:new FormControl(shareholder.email?shareholder.email:"",[Validators.required,Validators.email]),
          phone:new FormControl(shareholder.phoneNumber?shareholder.phoneNumber:"",[Validators.required,this._validators.phone]),
          addressGroup: this._fb.group({
            street:new FormControl(shareholder.address?.street?shareholder.address.street:"",[Validators.required]),
            city:new FormControl(shareholder.address?.city?shareholder.address.city:"",[Validators.required]),
            state:new FormControl(shareholder.address?.state?shareholder.address.state:"", [Validators.required])},
            {})},
          {}),
    },{validators:[Validators.required]})
  }
  
  buildShareholderGroups=(shareholders:ShareholderInfo[]):FormGroup[]=>{
    let groups:FormGroup[] = [];
    for(let i=0;i<shareholders.length;i++){
      groups.push(this.buildShareholderGroup(shareholders[i]));
    }
    return groups
  }

  addShareholder(){
    this.shareholderArray.push(this.buildShareholderGroup(new ShareholderInfo()));
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
    const shareholderInfos:ShareholderInfo[] = [];
    let f=form.value["shareholderArray"] as any[]; 
    console.log(f)
    f.forEach(group => {
     let shareholderInfo = new ShareholderInfo();
     shareholderInfo.title = group["title"];
     shareholderInfo.surname = group["surname"];
     shareholderInfo.otherNames = group["otherNames"];
     shareholderInfo.gender = group["gender"];
     shareholderInfo.maritalStatus = group["maritalStatus"];
     shareholderInfo.designation = group["designation"];
     shareholderInfo.educationalQualification = group["educationalQualification"];
     shareholderInfo.email = group["contactGroup"]["email"];
     shareholderInfo.phoneNumber = group["contactGroup"]["phone"];
     shareholderInfo.dob = new DOB();
     shareholderInfo.dob.day = group["dobGroup"]["day"];
     shareholderInfo.dob.month = group["dobGroup"]["month"];
     shareholderInfo.dob.year = group["dobGroup"]["year"];
     shareholderInfo.address = new Address();
     shareholderInfo.address.state = group["contactGroup"]["addressGroup"]["state"];
     shareholderInfo.address.city = group["contactGroup"]["addressGroup"]["city"];
     shareholderInfo.address.street = group["contactGroup"]["addressGroup"]["street"];
     shareholderInfos.push(shareholderInfo);
    });
    // [...form.value["shareholderArray"]]; 
    this._store.setShareholderInfo(shareholderInfos);
    this.onNavigate("collateral-info");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }
}