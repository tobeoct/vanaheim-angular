import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-progress-circular',
  templateUrl: './circular.component.html',
  styleUrls: ['./circular.component.scss']
})
export class ProgressCircularComponent implements OnInit, OnChanges {

  @Input()
  max:number=30

  @Input()
  daysLeft: number = 30;

  daysR: string;
  daysL: string;
  constructor() { }
  ngOnChanges(): void {
    this.calculateLR();
  }

  ngOnInit(): void {
    // this.calculateLR();
  }

  calculateLR() {
    let days = this.max - this.daysLeft;
    const halfDay = (this.max/2)
    let r = days > halfDay ? ((days - halfDay) / halfDay) * 180 : 0;
    let l = days <= halfDay ? (days / halfDay) * 180 : 0;
    l = l == 0 && days > 0 ? 180 : l;
    this.daysR = r + "deg";
    this.daysL = l + "deg";
  }
}
