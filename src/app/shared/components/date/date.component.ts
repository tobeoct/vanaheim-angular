import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { Store } from '../../helpers/store';
import { DateRange } from './date';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  @Input()
  dateGroup:FormGroup
  @Input()
  day:FormControl
  @Input()
  month:FormControl
  @Input()
  year:FormControl
  @Input()
  placeholder:string;
  @Input()
  class:string;
  @Input()
  range:DateRange = DateRange.above18;
  months:string[];
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();
  constructor(private _store:Store) { }

  ngOnInit(): void {
    this.months =this._store.months;
    this.modify();

    this.month.valueChanges.subscribe(v=>{
      const maxDay=this.getMaxDay(v,this.year.value);
      this.day.setValidators(Validators.max(maxDay));
      if(this.day.value>maxDay){
        this.day.patchValue(maxDay);
      }
      this.day.markAsTouched();
      this.day.updateValueAndValidity();
    })

    this.year.valueChanges.subscribe(v=>{
      this.modify()
    });
  }
  isValidDate=(day:number,year:number,month:string)=>{
    let date = `${year}-${month.substring(0,3)}-${day}`;
    let d:any = new Date(date);
      return d==="Invalid Date"? false: d.getDate()===1?false:true;
     
  }
 getMaxDayInMonth=(iMonth:string, iYear:number)=>{
  return this.isValidDate(31,iYear,iMonth)?31:30;
}

 isLeapyear=(year:number)=>
{
return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
}
 getMaxDay=(month:string,year:number):number=>{
 let maxDay =this.getMaxDayInMonth(month,year);
 let isLeap = this.isLeapyear(year);
 if(month==="February") maxDay=isLeap?29:28;
 return maxDay;
}
init(){
  
}
  modify(){
    let year = new Date().getFullYear();
    this.day.setValidators(Validators.max(this.getMaxDay(this.month.value,this.year.value)));
    switch(this.range){
    case DateRange.above18:
        this.year.setValidators(Validators.max(year-18))
        if(this.year.value>(year-18)){
          setTimeout(()=>this.year.patchValue(year-18),500);
          console.log(year-18)
        }
      break;
      default:
        this.year.setValidators(Validators.max(year))
        break;
    }
    
    this.year.markAsTouched();
    this.year.updateValueAndValidity();
    this.day.markAsTouched();
    this.day.updateValueAndValidity();
  }

}
