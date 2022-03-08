import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-loan-status',
  templateUrl: './loan-status.component.html',
  styleUrls: ['./loan-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanStatusComponent implements OnInit {

  @Input()
  loan$:Observable<any>
  
  widthSubject:BehaviorSubject<number> = new BehaviorSubject<number>(0);
  width$:Observable<number> = this.widthSubject.asObservable();
  constructor() { }

  ngOnInit(): void {
    this.loan$.subscribe(c=>{
      switch(c?.requestStatus){
        case "Pending":
            this.widthSubject.next(25);
          break;
        case "Processing":
          this.widthSubject.next(50);
          break;
        case "Approved":
          this.widthSubject.next(75);
          break;
        case "Funded":
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
    })
  }

}
