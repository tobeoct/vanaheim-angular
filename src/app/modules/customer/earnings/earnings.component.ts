import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { EarningService } from 'src/app/shared/services/earning/earning.service';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent implements OnInit {
  earnings$: Observable<any>;
  activeEarnings: boolean = false;
  totalEarnings: any[] = [];
  disbursedEarning$: Observable<any>;
  totalRepaymentSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalRepayment$: Observable<number> = this.totalRepaymentSubject.asObservable();

  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();

  base: string;

  pagingSubject: BehaviorSubject<any>;
  latestEarning$: Observable<any>;
  runningEarning$: Observable<any>;
  activeFilterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeFilter$: Observable<string> = this.activeFilterSubject.asObservable();
  constructor(private _earningService: EarningService) { }

  ngOnInit(): void {
  }
  
  getEarningStatusColor(status: string) {
    if (status == "Approved" || status == "Funded" || status == "Completed") return 'success';
    if (status == "NotQualified" || status == "Declined" || status == "Defaulting") return 'danger';
    return status == "Processing" ? '' : 'info';
  }
  trackByFn(index: any, item: any) {
    return index;
  }

  selectEarning(id: number) {
    // this._requestService.selectLoanLog(id);
    // this.showSubject.next(true);
  }  
  changeFilter(value: any) {
    // this.activate(value);
    // this._loanService.filterSubject.next(value);
  }

}
