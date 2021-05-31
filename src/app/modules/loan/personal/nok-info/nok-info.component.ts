import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { NOKInfo } from './nok-info';
import { DateRange } from 'src/app/shared/components/date/date';

@Component({
  selector: 'app-nok-info',
  templateUrl: './nok-info.component.html',
  styleUrls: ['./nok-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class NOKInfoComponent implements OnInit {
  form:FormGroup;
  titles:string[];
  months:string[];
  states:string[];
  range:DateRange = DateRange.all;
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  

  get surname(){
    return this.form.get("surname") as FormControl|| new FormControl();
  }
  get otherNames(){
    return this.form.get("otherNames") as FormControl|| new FormControl();
  }
  get title(){
    return this.form.get("title") as FormControl|| new FormControl();
  }

  get relationship(){
    return this.form.get("relationship") as FormControl|| new FormControl();
  }


  get dobGroup(){
    return this.form.get("dobGroup") as FormGroup|| new FormControl();
  }
  get day(){
    return this.form.get("dobGroup.day") as FormControl|| new FormControl();
  }
  get month(){
    return this.form.get("dobGroup.month") as FormControl|| new FormControl();
  }
  get year(){
    return this.form.get("dobGroup.year") as FormControl|| new FormControl();
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


    base:string;
  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store,
    private _validators:VCValidators, private _route: ActivatedRoute) {
      this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
        this.base = x.url.replace(/\/[^\/]*$/, '/');
       });
     }
  focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  focus$:Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  loading$:Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();
  ngOnInit(): void {
    
    let max = new Date().getFullYear();
    const nokInfo = this._store.nokInfo as NOKInfo;
    this.form = this._fb.group({
      surname: [nokInfo.surname?nokInfo.surname:"",[Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
      otherNames: [nokInfo.otherNames?nokInfo.otherNames:""],
      title: [nokInfo.title?nokInfo.title:"",[Validators.required]],
      relationship: [nokInfo.relationship?nokInfo.relationship:"",[Validators.required]],
      dobGroup: this._fb.group({
        day: [nokInfo.dob?.day?nokInfo.dob.day:1, [Validators.required, Validators.min(1), Validators.max(31)]],
        month: [nokInfo.dob?.month?nokInfo.dob.month:'January', [Validators.required]],
        year: [nokInfo.dob?.year?nokInfo.dob.year:max, [Validators.required, Validators.min(1900), Validators.max(2002)]]},
        {}),
        contactGroup: this._fb.group({
          email: [nokInfo.email?nokInfo.email:"",[Validators.required,Validators.email]],
          phone: [nokInfo.phoneNumber?nokInfo.phoneNumber:"",[Validators.required,this._validators.phone]]},
         
          {}),
       
  });
    this._store.titleSubject.next("Next Of Kin Information");
    this.titles = this._store.titles;
    this.states =this._store.states;
    this.months= this._store.months;
  }

  allSubscriptions:Subscription[]=[];
  focus(){
    this.focusSubject.next(true)
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
    const nokInfo:NOKInfo ={id:0,title:this.title.value,relationship:this.relationship.value, surname: this.surname.value, otherNames: this.otherNames.value, email: this.email.value, phoneNumber:this.phone.value, dob:{day:this.day.value, month: this.month.value, year:this.year.value}};
     this._store.setNOKInfo(nokInfo);
    this.onNavigate("upload");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }
}
