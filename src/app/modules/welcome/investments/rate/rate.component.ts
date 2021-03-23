import { Component, Input,Output, EventEmitter, OnInit } from '@angular/core';
import { Utility } from 'src/shared/helpers/utility';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {
  @Input() amount:number;
  @Output() rateDetailChange = new EventEmitter();
  rate:number;
  payout:number;
  durations:any[] = [{value:12,active:false},{value:9,active:false},{value:6,active:false},{value:3,active:false}];
  utility = new Utility();
  
  constructor() { }

  ngOnInit(): void {
  }
  trackByFn(index:any, item:any) {
    return index; // or item.id
    }
  activate(duration:number){
    this.durations = this.durations.map(d=>{
      if(d.value==duration){d.active=true;}else{
        d.active = false;
      }
      return d;
    })
  }
  getMaturity(){
    return  addMonths(new Date(),this.getDuration());
  }
  getDuration(){
    return this.durations.filter(d=>{return d.active})[0].value;
  }
  getInterest(){
    return this.calculatePayout()- this.utility.convertToPlainNumber(this.amount);
  }
  calculatePayout(){
    return this.utility.convertToPlainNumber(this.amount)+ ((((this.rate/12)/100)*this.utility.convertToPlainNumber(this.amount))*this.getDuration());
  }
  calculateTotalPayout(){
    const tax =(this.getInterest()*0.1);
    const mgtFee = this.utility.convertToPlainNumber(this.amount)*0.005;
    return this.calculatePayout() - (tax+mgtFee);

  }
  onChange(r:any){
    let rateDetail:any ={};
    this.rate = parseInt(r);
    rateDetail["duration"] = this.getDuration();
    rateDetail["maturity"] = sugarize(this.getMaturity());
    rateDetail["payout"] = this.calculateTotalPayout();
    rateDetail["rate"] = this.rate;
     this.rateDetailChange.emit(rateDetail);
}


}

const addMonths=(date:any, months:any)=> {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}


const sugarize=(d:any)=>{
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
const mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(d)
const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
return `${mo} ${ye}`;
}