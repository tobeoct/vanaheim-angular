import { ChangeDetectionStrategy } from '@angular/core';
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { Subject, Observable, BehaviorSubject, from } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { ElementStyle, ElementSize, ElementState } from 'src/app/shared/constants/enum';
import { ButtonOptions, AssetPath } from 'src/app/shared/constants/variables';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { IAssetPath } from 'src/app/shared/interfaces/assetpath';
import { InvestmentIndication, RateDetail } from '../investment';
import { InvestmentService } from '../investment.service';

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
    range:"Invalid amount: 100K - 50M"
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
minAmount:number = 100000;
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


loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
loading$:Observable<boolean> = this.loadingSubject.asObservable();

focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
focus$:Observable<boolean> = this.focusSubject.asObservable();

amountSubject:BehaviorSubject<number> = new BehaviorSubject<number>(250000); 
amount$:Observable<number> = this.amountSubject.asObservable();

changedSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
changed$:Observable<boolean> = this.changedSubject.asObservable();



  constructor( private _fb:FormBuilder, private _zone: NgZone,private _utility:Utility, private _validators:VCValidators, private _investmentService:InvestmentService) {
   }
  ngAfterViewInit(): void {
      this.delay$.subscribe(c=>{
          this.focus();    
      })
  }

   ngOnInit(): void {
    this.form = this._fb.group({
      amount: ["100,000",[Validators.required,Validators.minLength(6),Validators.maxLength(10), this._validators.numberRange(this.minAmount,this.maxAmount)]],
      duration: [0,[Validators.required]],
      maturity:['',[Validators.required]],
      rate:[0,[Validators.required, Validators.min(15)]],
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
    this.loadingSubject.next(true);
    this._investmentService.apply(this.form.value).pipe(take(1)).subscribe(
      data=>{  this._zone.run(() => {
       this.loadingSubject.next(false);
       setTimeout(()=>{this._investmentService.success(data.message); this._investmentService.show(true);},0);
      
   
      })
     },
     (error:string) => {
       this.loadingSubject.next(false);
       if(error=="Not Found") error = "You do not seem to be connected to the internet";
       setTimeout(()=>{this._investmentService.error(error);this._investmentService.show2(true);},0);
       
     });
       
      
  }

  
}
