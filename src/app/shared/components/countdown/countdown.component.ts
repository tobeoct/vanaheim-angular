import { Component, Input, OnInit } from '@angular/core';
import moment = require('moment');
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  @Input()
  startingValue: number = 0;

  @Input()
  endValue: number;

  @Input()
  startingDate: Date

  @Input()
  endDate: Date;

  @Input()
  class: string

  @Input()
  size: string ='lg'

  amount: number

  subscription:Subscription
  constructor() { }

  ngOnDestroy(){
    if(this.subscription) this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.countdown();
   this.subscription= interval(1000).subscribe(() => this.countdown())
  }

  countdown() {
    const totalTime = moment(this.endDate).diff(this.startingDate, "seconds");
    const timeElapsed = moment().diff(this.startingDate, "seconds");
    const percentageElapsed = timeElapsed / totalTime;
    const value = (+this.endValue) - (+this.startingValue);
    this.amount = (+this.startingValue) + (percentageElapsed * value);
  }

}
