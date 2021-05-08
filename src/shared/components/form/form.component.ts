import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import  VCValidators  from '@validators/default.validators';
import { Output } from '@angular/core';
import { Utility } from 'src/shared/helpers/utility.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit, OnDestroy,AfterViewInit {
  @Input()
  form: FormGroup;
  
  @Input()
  class:string;
  // @Input()
  // onSubmit:(form:FormGroup)=>any; 
  @Output() onSubmit = new EventEmitter<FormGroup>();

  errorList:any={exists:true};
  allSubs:Subscription[]=[];
  setMessage:(c:AbstractControl,key:string)=>void;
 values:any={};
  errorMessageSubject:Subject<any> = new Subject<any>();
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable(); 
  @Output() 
  errorMessageChange = new EventEmitter<any>();

  @Output() 
  valueChange = new EventEmitter<any>();
  constructor(
     
      private _validators:VCValidators,
      private _utility:Utility
  ) { 
      // redirect to home if already logged in
      this.setMessage = this._validators.setMessage(this.errorList,this.errorMessageSubject);
  }
  ngAfterViewInit(): void {
    this.addValidation(this.f)
   const sub = this.errorMessage$.pipe(map(r=>{this.errorList=r; return r;})).subscribe(r=> this.errorMessageChange.emit(r))
    this.allSubs.push(sub);
    
  }
ngOnDestroy(){
  this.allSubs.forEach(sub=>{
    sub.unsubscribe();
  })
}
  ngOnInit() {
    
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  handleSubmit=()=>{
    console.log("submitting")
    this.onSubmit.next(this.form);
  }
   
    
addValidation(group:any){
  for(let key in group){
    let ctrl = group[key];
    if(ctrl){
      if(!key.toLowerCase().includes("group")){
       
      this.allSubs.push(ctrl.valueChanges.pipe(debounceTime(500)).subscribe(()=>{

        this.valueChange.emit({[key]:ctrl.value});
        if(key.toLowerCase().includes("amount")) {
          ctrl.patchValue(this._utility.currencyFormatter(this._utility.convertToPlainNumber(ctrl.value)));
        }
        this.setMessage(ctrl||new FormControl(),key)
      }
        
        ))
      }
      else{
        let g = group[key] as FormGroup;
        this.addValidation(g.controls);
      }
   }
  }
  return;
}
}
