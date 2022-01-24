import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-earning-status',
  templateUrl: './earning-status.component.html',
  styleUrls: ['./earning-status.component.scss']
})
export class EarningStatusComponent implements OnInit {

  @Input()
  earnings: any;

  @Input()
  total: number;

  @Input()
  index: number;

  widthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  width$: Observable<number> = this.widthSubject.asObservable();
  constructor() { }

  ngOnInit(): void {

    switch (this.earnings.requestStatus) {
      case "Pending":
        this.widthSubject.next(25);
        break;
      case "Processing":
        this.widthSubject.next(50);
        break;
      case "Approved":
        this.widthSubject.next(75);
        break;
      case "FundsReceived":
        this.widthSubject.next(100);
        break;
      case "UpdateRequired":
        this.widthSubject.next(75);
        break;
      case "NotQualified":
        this.widthSubject.next(100);
        break;
      default:
        this.widthSubject.next(0);
        break;
    }

  }
  ngOnChanges(): void {

    switch (this.earnings.requestStatus) {
      case "Pending":
        this.widthSubject.next(25);
        break;
      case "Processing":
        this.widthSubject.next(50);
        break;
      case "Approved":
        this.widthSubject.next(75);
        break;
      case "FundsReceived":
        this.widthSubject.next(100);
        break;
      case "UpdateRequired":
        this.widthSubject.next(75);
        break;
      case "NotQualified":
        this.widthSubject.next(100);
        break;
      default:
        this.widthSubject.next(0);
        break;
    }

  }
}
