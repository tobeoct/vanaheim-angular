import {Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, Observable, from, Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { AssetPath } from 'src/app/shared/constants/variables';
import { IAssetPath } from 'src/app/shared/interfaces/assetpath';
import { Store } from 'src/app/shared/helpers/store';
import { LoanService } from 'src/app/shared/services/loan/loan.service';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { LoanDetails } from '../../loan/shared/loan-calculator/loan-details';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  
  @ViewChild('applyNow') applyNow:ElementRef;
  form: FormGroup;
  assetPaths: IAssetPath = new AssetPath;
  activeLoan:boolean=false;
  totalLoans:any[]=[];
  loanCalculator:any;
  get loanType(){
    return this.form.get("loanType") as FormControl|| new FormControl();
  }
  get purpose(){
    return this.form.get("purpose") as FormControl|| new FormControl();
  }
  get loanAmount(){
    return this.form.get("loanAmount") as FormControl|| new FormControl();
  }

  get tenure(){
    return this.form.get("tenure") as FormControl|| new FormControl();
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  loanDetailsSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  loanDetails$:Observable<any> = this.loanDetailsSubject.asObservable();
  focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  focus$:Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(3000));
errorMessageSubject:Subject<any> = new Subject<any>(); 
errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();

apiSuccessSubject:Subject<string> = new Subject<string>(); 
apiSuccess$:Observable<string> = this.apiSuccessSubject.asObservable();

apiErrorSubject:Subject<string> = new Subject<string>(); 
apiError$:Observable<string> = this.apiErrorSubject.asObservable();

loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
loading$:Observable<boolean> = this.loadingSubject.asObservable();

dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
rate:number;
minTenure:number=1;
maxTenure:number=12;
range:any;
tenureDenominator:string = "Mos";
loanDetails:LoanDetails;
monthlyRepaymentSubject:BehaviorSubject<number> = new BehaviorSubject<number>(0); 
monthlyRepayment$:Observable<number> = this.monthlyRepaymentSubject.asObservable();
loans$:Observable<any>;

totalRepaymentSubject:BehaviorSubject<number> = new BehaviorSubject<number>(0); 
totalRepayment$:Observable<number> = this.totalRepaymentSubject.asObservable();

showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
show$:Observable<boolean> = this.showSubject.asObservable();

base:string;

pagingSubject:BehaviorSubject<any>;
latestLoan$:Observable<any>;
runningLoan$:Observable<any>;
tenureDenominatorSubject:BehaviorSubject<string> = new BehaviorSubject<string>("Mos"); 
tenureDenominator$:Observable<string> = this.tenureDenominatorSubject.asObservable();
  constructor(private _fb: FormBuilder, private _store:Store, private _utility:Utility,
    private _router:Router,
    private _validators:VCValidators,
    private _loanService: LoanService) {
      this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
        this.base = x.url+'/';//.replace(/\/[^\/]*$/, '/');
       });
     }
 
  ngOnInit(): void {
  this.loanDetails = this._store.loanCalculator as LoanDetails;
  this.loanCalculator = this._store.loanCalculator;
  this.loanDetailsSubject.next(this._store.loanCalculator)
  this.latestLoan$ = this._loanService.latestLoan$;
  this.runningLoan$ = this._loanService.runningLoan$;
  this.loans$ = this._loanService.loanWithFilter$;
  // this.search()
  let lType =this._store.loanType||"Personal Loans";
  let tenureRange = this._loanService.getTenureRange(lType);
  this.minTenure = tenureRange["min"];
  this.maxTenure = tenureRange["max"];
    this._store.titleSubject.next("Loan Calculator");
    this.range = this._loanService.getMinMax(lType);
    this.form = this._fb.group({
      loanAmount: [this.loanDetails.loanAmount?this.loanDetails.loanAmount:this._utility.currencyFormatter(this.range.min),[Validators.required,Validators.minLength(6),Validators.maxLength(10), this._validators.numberRange(this.range.min,this.range.max)]],
      purpose: [this.loanDetails.purpose?this.loanDetails.purpose:''],
      tenure: [this.loanDetails.tenure?this.loanDetails.tenure:1,[Validators.required,this._validators.numberRange(this.minTenure,this.maxTenure)]],
      loanType: [lType, [Validators.required]],
  });
  this.tenureDenominatorSubject.next(this._loanService.getDenominator(this.tenure.value,this.loanType.value));
    // let d = data.filter(d=>d.allowedTypes.includes(this.loanType)&&d.allowedApplicant.includes(this.applyingAs));
    // this.dataSelectionSubject.next(d);
    this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(this.loanAmount.value),this.tenure.value,this.loanType.value));
    this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value,this.tenure.value));

    this.loanAmount.valueChanges.subscribe(v=>{
      
    this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(v),this.tenure.value,this.loanType.value));
    this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value,this.tenure.value));
    this.rate = this._loanService.getRate(lType,this._utility.convertToPlainNumber(this.loanAmount.value),this.range.min,this.range.max);  
  })

    this.tenure.valueChanges.subscribe(v=>{
      
      this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(this.loanAmount.value),v,this.loanType.value));
      this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value,v));
      this.tenureDenominatorSubject.next(this._loanService.getDenominator(v,this.loanType.value)); 
      this.rate = this._loanService.getRate(lType,this._utility.convertToPlainNumber(this.loanAmount.value),this.range.min,this.range.max); 
    })

    this.pagingSubject = this._loanService.pagingSubject;
  }
 moveToApply():void {
    this.applyNow.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
}
  // search(){
  //   this.loans$ = this._loanService.loanWithFilter$;
  // }
  onSubmit(form:FormGroup) {
        
    // stop here if form is invalid
    if (form.invalid) {
        return;
    }
    if(!this._loanService.runningLoanSubject.value){
    this.loadingSubject.next(true);

    this._store.setLoanType(this.loanType.value);
    const loanDetails:LoanDetails = {rate:this.rate,monthlyRepayment:this.monthlyRepaymentSubject.value.toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN'}),loanAmount: this.loanAmount.value, tenure:this.tenure.value, denominator: this.tenureDenominatorSubject.value,purpose:this.purpose.value, totalRepayment: this.totalRepaymentSubject.value.toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN'})};
    this._store.setLoanCalculator(loanDetails);
    this.onNavigate('apply/applying-as');
      }else{
        this._utility.toggleLoanInvalid();
      }
}
onNavigate(route:string,params:any={}):void{
  let r = this.base+route;
  // console.log(r);
  this._router.navigate([r],{queryParams: params})
}
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }
  changeFilter(event:any){
    this._loanService.filterSubject.next(event);
  }
  
  trackByFn(index:any,item:any){
    return index;
  }
  close(){
    this.showSubject.next(false);
  }
}
