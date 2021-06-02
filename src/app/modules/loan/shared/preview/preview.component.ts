import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { LoanResponse } from 'src/app/shared/poco/loan/loan-response';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';
import { BaseLoanApplication, BusinessLoanApplication, PersonalLoanApplication } from '../../loan-application';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit {

  loanApplication:any;
  isLoggedIn:boolean=false;
  form:FormGroup;
  loanType:string;
  key:string;
  category:string;
  showSubject:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  show$:Observable<boolean> = this.showSubject.asObservable();
  show2Subject:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  show2$:Observable<boolean> = this.show2Subject.asObservable();
  show3Subject:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  show3$:Observable<boolean> = this.show3Subject.asObservable();
  loadingSubject:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  loading$:Observable<boolean> = this.loadingSubject.asObservable();
  apiErrorSubject:Subject<string>= new Subject<string>();
  apiError$:Observable<string> = this.apiErrorSubject.asObservable();
  apiSuccessSubject:Subject<string>= new Subject<string>();
  apiSuccess$:Observable<string> = this.apiSuccessSubject.asObservable();
  constructor(private _store:Store,private _router:Router, private _zone:NgZone, private _fb:FormBuilder,private _authenticationService:AuthService, private _loanService:LoanService) { }

  ngOnInit(): void {
    this.isLoggedIn = this._authenticationService.isLoggedIn();
    this.loanType = this._store.loanType;
    this.category = this._store.loanCategory;
    this._store.titleSubject.next("Preview");
    this.form = this._fb.group({
      validated: [this._loanService.validateLoanApplication()?'valid':'',[Validators.required]]
    })
    this.loanApplication =this._store.loanApplication[this._store.loanCategory];
  }

  close=()=>{
    this.showSubject.next(false);
  }
  close2=()=>{
    this.show2Subject.next(false);
    // this.apiErrorSubject.next();
    // this.apiSuccessSubject.next();
  }
  close3=()=>{
    this.show3Subject.next(false);
    // this.apiErrorSubject.next();
    // this.apiSuccessSubject.next();
  }
  toJson(value:any):any{
    return JSON.parse(value);
  }
   submitApplication(event:any){
     if(this.isLoggedIn){
     this.loadingSubject.next(true);
    let category = this._store.loanCategory;
let a = this._store.loanApplication;
    let application:BaseLoanApplication ;
    if(category == "business"){
      application = a["business"] as BusinessLoanApplication;
    }else{
      application = a["personal"] as PersonalLoanApplication;
    }

    let loanResponse = new LoanResponse();
    loanResponse.category = category;
    loanResponse.loanApplication = application; 
  this._loanService.apply(loanResponse).pipe(take(1)).subscribe(
   data=>{  this._zone.run(() => {
    this.loadingSubject.next(false);
    this.apiSuccessSubject.next(data.loanRequestId);
    this.show2Subject.next(true);
    setTimeout(()=>
this.apiSuccessSubject.next(),3000);

   })
  },
  (error:string) => {
    this._zone.run(() => {
    this.loadingSubject.next(false);
this.apiErrorSubject.next(error);
this.show3Subject.next(true);
setTimeout(()=>
this.apiErrorSubject.next(),3000);
})
  }
  );
    
     }else{
       this.showSubject.next(true);
     }
  }
  onNavigate(route:string,params:any={}):void{
    let base =this.isLoggedIn?"my/loans/apply/":"welcome/loans/apply/"
    const r =base+route;
    this._router.navigate([r],{queryParams: params})
  }
}
