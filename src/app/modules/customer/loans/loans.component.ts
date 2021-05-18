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
import { LoanDetails } from '../../loan/personal/loan-calculator/loan-details';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  
  @ViewChild('applyNow') public applyNow:ElementRef;
  form: FormGroup;
  assetPaths: IAssetPath = new AssetPath;
  activeLoan:boolean=false;
  totalLoans:any[]=[];
  get loanType(){
    return this.form.get("loanType") as FormControl|| new FormControl();
  }
  get loanAmount(){
    return this.form.get("loanAmount") as FormControl|| new FormControl();
  }

  get tenure(){
    return this.form.get("tenure") as FormControl|| new FormControl();
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

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

minTenure:number=1;
maxTenure:number=12;
range:any;
tenureDenominator:string = "Mos";
loanDetails:LoanDetails;
monthlyRepaymentSubject:BehaviorSubject<number> = new BehaviorSubject<number>(0); 
monthlyRepayment$:Observable<number> = this.monthlyRepaymentSubject.asObservable();


totalRepaymentSubject:BehaviorSubject<number> = new BehaviorSubject<number>(0); 
totalRepayment$:Observable<number> = this.totalRepaymentSubject.asObservable();

base:string;

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
    this.range = this._loanService.getMinMax('Personal Loans');
    this.form = this._fb.group({
      loanAmount: [this._utility.currencyFormatter(this.range.min),[Validators.required,Validators.minLength(6),Validators.maxLength(10), this._validators.numberRange(this.range.min,this.range.max)]],
      loanType: ['Personal Loans', [Validators.required]],
      tenure: [1,[Validators.required,this._validators.numberRange(this.minTenure,this.maxTenure)]],
  });
  this.tenureDenominatorSubject.next(this._loanService.getDenominator(this.tenure.value,this.loanType.value));
    // let d = data.filter(d=>d.allowedTypes.includes(this.loanType)&&d.allowedApplicant.includes(this.applyingAs));
    // this.dataSelectionSubject.next(d);
    this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(this.loanAmount.value),this.tenure.value,this.loanType.value));
    this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value,this.tenure.value));

    this.loanAmount.valueChanges.subscribe(v=>{
      
    this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(v),this.tenure.value,this.loanType.value));
    this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value,this.tenure.value));
    })

    this.tenure.valueChanges.subscribe(v=>{
      
      this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(this.loanAmount.value),v,this.loanType.value));
      this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value,v));
      this.tenureDenominatorSubject.next(this._loanService.getDenominator(v,this.loanType.value));  
    })
  }
 moveToApply():void {
    this.applyNow.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
}
  
  onSubmit(form:FormGroup) {
        
    // stop here if form is invalid
    if (form.invalid) {
        return;
    }

    this.loadingSubject.next(true);

    this._store.setLoanType(this.loanType.value);
    const loanDetails:LoanDetails = {monthlyRepayment:this.monthlyRepaymentSubject.value,loanAmount: this.loanAmount.value, tenure:this.tenure.value, denominator: this.tenureDenominatorSubject.value,purpose:"", totalRepayment: this.totalRepaymentSubject.value};
    this._store.setLoanCalculator(loanDetails);
    this.onNavigate('apply/applying-as');
}
onNavigate(route:string,params:any={}):void{
  let r = this.base+route;
  console.log(r);
  this._router.navigate([r],{queryParams: params})
}
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }

}
