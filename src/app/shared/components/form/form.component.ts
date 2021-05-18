import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Output } from '@angular/core';
import { Utility } from 'src/app/shared/helpers/utility.service';
import {VCValidators} from 'src/app/shared/validators/default.validators';

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
    this.onSubmit.next(this.form);
  }

private validateFormArray(formArray:FormArray,key:string){
  for(let i=0;i<formArray.length;i++){
    let c = formArray.at(i);
    if(c instanceof FormGroup){
      // console.log("Is Group")
        let grp = c as FormGroup;
        this.addValidation(grp.controls);
    }
    if(c instanceof FormArray){
            
      // console.log("Is Array")
      let controls = c as FormArray;
      this.validateFormArray(controls,key);
    }
    else{
      let ctrl = c as FormControl;
      this.validateControl(ctrl,key);

    }
  }
}
private validateControl(ctrl:FormControl,key:string){
  this.allSubs.push(ctrl.valueChanges.pipe(debounceTime(500)).subscribe(()=>{

    this.valueChange.emit({[key]:ctrl.value});
    if(key.toLowerCase().includes("amount")) {
      ctrl.patchValue(this._utility.currencyFormatter(this._utility.convertToPlainNumber(ctrl.value)));
    }
    this.setMessage(ctrl||new FormControl(),key)
  }
  
    
    ));
}
private addValidation(group:any){
 
        for(let key in group){
          let ctrl = group[key];

          if(ctrl instanceof FormGroup){
            // console.log("Is Group")
              let grp = ctrl as FormGroup;
              this.addValidation(grp.controls);
          }
          if(ctrl instanceof FormArray){
            
            // console.log("Is Array")
            let controls = ctrl as FormArray;
            this.validateFormArray(controls,key);
          }
else{
          if(ctrl){
        this.validateControl(ctrl,key);
      }
    }
      }
      
   
  
  return;
}


}
