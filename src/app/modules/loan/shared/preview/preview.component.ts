import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  loanApplication:any[]=[];
  isLoggedIn:boolean=false;
  form:FormGroup;
  loanType:string;
  key:string;
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
  constructor(private _store:Store,private _router:Router, private _fb:FormBuilder,private _authenticationService:AuthService, private _loanService:LoanService) { }

  ngOnInit(): void {
    this.isLoggedIn = this._authenticationService.isLoggedIn();
    this.loanType = this._store.loanType;
    this._store.titleSubject.next("Preview");
    this.form = this._fb.group({
    })
    let application= this._store.loanApplication[this._store.loanCategory];
    for(let key in application){
      let obj:any = {};
      obj[key] = [];
      let a:any = application[key];
      if(a.startsWith('{')||a.startsWith('[')) {
        // console.log(a)
        a = JSON.parse(a);
      }
      // console.log(a);
      if(Array.isArray(a)){
        obj[key] = this.handleArray(a,obj[key]);
      } else if (a instanceof Object){
        obj[key] = this.handleObject(a,obj[key]);
    }else{
      obj[key].push(a);
    }
    this.loanApplication.push(obj);
    }
  }

  handleArray(arr:any[], obj:any){
    let o:any[] = [];
    arr.forEach((a,i)=>{
      if(Array.isArray(a)){this.handleArray(a,obj[i]);}
      else if (a instanceof Object){
        o= this.handleObject(a,obj);
      }else{
        obj[i] = a
        o.push({[i]:a});
      }

    })
    return o;
  }

  handleObject(value:any, obj:any):any{
    let o:any[] = [];
    for(let key in value){
      let a = value[key];
      obj[key]= {};
      if(Array.isArray(a)){o = this.handleArray(a,obj[key])}
      else if (a instanceof Object){
        this.handleObject(a,obj[key]);
      }else{
        obj[key] = a;
        o.push({[key]:a});
      }
    }
    // console.log(o);
    return o;
  }
  isArray(value:any){
    return Array.isArray(value);
  }
  isString(value:any){
    return typeof value === 'string' || value instanceof String;
  }
  convertFromUnknown(value:unknown):any{
    let v = value as any;
    return v;
  }
  convertToString(value:unknown):string{
    console.log(value)
    
    let v:string= value as string;
    // console.log(this.loanApplication[v]);
    return v;
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
   data=>{ 
     console.log("Res",data)
    this.loadingSubject.next(false);
    this.apiSuccessSubject.next(data.loanRequestId);
    this.show2Subject.next(true);
  },
  (error:string) => {
    console.log("Error",error)
    this.loadingSubject.next(false);
this.apiErrorSubject.next(error);
this.show3Subject.next(true);
// setTimeout(()=>{this.show2Subject.next(false);this.apiErrorSubject.next();},5000)
  }
  );
    
     }else{
       this.showSubject.next(true);
     }
  }
  onNavigate(route:string,params:any={}):void{
    // const r =this.base+route;
    this._router.navigate([route],{queryParams: params})
  }
}
