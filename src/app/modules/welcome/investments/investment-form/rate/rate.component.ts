import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Utility } from 'src/app/shared/helpers/utility.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateComponent implements OnInit {
  @Input()
  amount$: Observable<number> = from([0]);
  amount: number;
  @Input()
  type:string;
  @Output() rateDetailChange = new EventEmitter();
  rateSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  payoutSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  rate$: Observable<number> = this.rateSubject.asObservable();
  payout$: Observable<number> = this.payoutSubject.asObservable();
  durationsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([{ value: 12, active: false }, { value: 6, active: false }, { value: 3, active: false }])
  durations$: Observable<any[]> = this.durationsSubject.asObservable();
  // { value: 9, active: false },

  constructor(private utility: Utility) { }

  ngOnInit(): void {
    // this
    this.amount$.subscribe(v => this.amount = v);
  }
  trackByFn(index: any, item: any) {
    return index; // or item.id
  }
  activate(duration: number) {
    this.durationsSubject.next(this.durationsSubject.value.map(d => {
      if (d.value == duration) { d.active = true; } else {
        d.active = false;
      }
      return d;
    }))
  }
  getMaturity() {
    return addMonths(new Date(), this.getDuration());
  }
  getDuration() {
    return this.durationsSubject.value.filter(d => { return d.active })[0].value;
  }
  getInterest() {
    return this.calculatePayout() - this.utility.convertToPlainNumber(this.amount);
  }
  calculatePayout() {
    return this.utility.convertToPlainNumber(this.amount) + ((((this.rateSubject.value / 12) / 100) * this.utility.convertToPlainNumber(this.amount)) * this.getDuration());
  }
  calculateTotalPayout() {
    const tax = (this.getInterest() * 0.1);
    const mgtFee = this.utility.convertToPlainNumber(this.amount) * 0.005;
    const total = this.calculatePayout() - (tax + mgtFee);
    return total;

  }
  onChange(r: any) {
    let rateDetail: any = {};
    this.rateSubject.next(parseInt(r));
    rateDetail["duration"] = this.getDuration();
    rateDetail["maturity"] = sugarize(this.getMaturity());
    rateDetail["payout"] = this.calculateTotalPayout();
    rateDetail["rate"] = this.rateSubject.value;
    this.rateDetailChange.emit(rateDetail);
  }


}

const addMonths = (date: any, months: any) => {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}


const sugarize = (d: any) => {
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
  const mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(d)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
  return `${mo} ${ye}`;
}