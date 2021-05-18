import { ChangeDetectionStrategy } from '@angular/core';
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { Subject, Observable, BehaviorSubject, from } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ElementStyle, ElementSize, ElementState } from 'src/app/shared/constants/enum';
import { ButtonOptions, AssetPath } from 'src/app/shared/constants/variables';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { IAssetPath } from 'src/app/shared/interfaces/assetpath';
import { InvestmentIndication, RateDetail } from '../investment';

@Component({
  selector: 'app-investment-form',
  templateUrl: './investment-form.component.html',
  styleUrls: ['./investment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestmentFormComponent implements OnInit,AfterViewInit {
  private validationMessages:any = {
    email:'Incorrect email format',
    required:"Please enter an email address",
    range:"Invalid amount: 50K - 50M"
  }
  investment:InvestmentIndication= new InvestmentIndication;
  form:FormGroup;
  buttonOptions:ButtonOptions= new ButtonOptions("I Am Interested",ElementStyle.default,"",ElementSize.default,true,ElementState.default);
  
  assetPaths:IAssetPath = new AssetPath;
  mobile:string = "sm-mobile";
  desktop:string="sm-desktop";
  headerclass:string ="header";
  showModal:boolean=false;
  modalType:string = 'investment-indication';
  rateDetail:RateDetail;
minAmount:number = 50000;
maxAmount:number = 50000000;

get duration(){
    return this.form.get("duration") as FormControl|| new FormControl();
  }
  get amount(){
    return this.form.get("amount") as FormControl|| new FormControl();
  }
  get email(){
    return this.form.get("emailAddress") as FormControl|| new FormControl();
  }
  get name(){
    return this.form.get("name") as FormControl|| new FormControl();
  }
  get rate(){
    return this.form.get("rate") as FormControl|| new FormControl();
  }
  get payout(){
    return this.form.get("payout") as FormControl|| new FormControl();
  }
  get maturity(){
    return this.form.get("maturity") as FormControl|| new FormControl();
  }
delay$ = from([1]).pipe(delay(1000));


errorMessageSubject:Subject<any> = new Subject<any>(); 
errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();

apiSuccessSubject:Subject<string> = new Subject<string>(); 
apiSuccess$:Observable<string> = this.apiSuccessSubject.asObservable();

apiErrorSubject:Subject<string> = new Subject<string>(); 
apiError$:Observable<string> = this.apiErrorSubject.asObservable();

loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
loading$:Observable<boolean> = this.loadingSubject.asObservable();

focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
focus$:Observable<boolean> = this.focusSubject.asObservable();

amountSubject:BehaviorSubject<number> = new BehaviorSubject<number>(250000); 
amount$:Observable<number> = this.amountSubject.asObservable();

changedSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
changed$:Observable<boolean> = this.changedSubject.asObservable();

  constructor( private _fb:FormBuilder, private _zone: NgZone,private _utility:Utility, private _validators:VCValidators) {
   }
  ngAfterViewInit(): void {
      this.delay$.subscribe(c=>{
          this.focus();    
      })
  }

   ngOnInit(): void {
    this.form = this._fb.group({
      amount: ["250,000",[Validators.required,Validators.minLength(6),Validators.maxLength(10), this._validators.numberRange(this.minAmount,this.maxAmount)]],
      duration: [0,[Validators.required]],
      maturity:['',[Validators.required]],
      rate:[0,[Validators.required]],
      payout:[0,[Validators.required]],
      emailAddress:['',[Validators.required,Validators.email]],
      name:['',[Validators.required,Validators.minLength(3)]]
    })
   
  }


focus(){
  this.focusSubject.next(true)
}

rateDetailChange(value:any){
  this.rateDetail =  value;
  const {rate,payout,maturity,duration} = value;
  this.maturity.patchValue(maturity);
  this.duration.patchValue(duration);
  this.rate.patchValue(rate);
  this.payout.patchValue(payout);
}
onError(value:any){
  this.errorMessageSubject.next(value);
}
onChange(obj:any){
  if(Object.keys(obj).includes("amount") && this._utility.convertToPlainNumber(obj.amount)!=this.amountSubject.value){

  this.amountSubject.next(this._utility.convertToPlainNumber(obj.amount));
  }else{
    this.changedSubject.next(true);

  }
}
  onSubmit(event:any){
    // console.log(event)
    // event.preventDefault();
    
    // this.showModal=true;
    // form.amount = this.amount;
    // form.duration = this.rateDetail.duration;
    // form.maturity = this.rateDetail.maturity;
    // form.rate= this.rateDetail.rate;
    // form.payout= this.rateDetail.payout;
    // form.emailAddress =this.emailAddress;
    // form.preferredName = this.name;
    console.log(this.form.value)
    // const payload = {email:form.emailAddress, payload:{amount : form.amount, duration:form.duration, payout:form.payout, name:form.preferredName,rate:form.rate, maturity: form.maturity}};
    //   new APIHelper().post("sendinvestment", payload,undefined).then(res=>{
    //     console.log("Investment",res)
    //     this.showModal=true;
    //   }).catch(err=>{console.log(err);this.showModal=true;});
    
  }

   
}
