import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestService } from 'src/app/modules/admin/request/request.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';

@Component({
  selector: 'app-loan-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @Input()
  loans:any

  @Output()
  selectLoan:EventEmitter<any> = new EventEmitter<any>()
  pagingSubject: BehaviorSubject<any>;
  totalLoans: any[] = [];
  
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();

  activeFilterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeFilter$: Observable<string> = this.activeFilterSubject.asObservable();
  constructor(private _route: ActivatedRoute, private _loanService: LoanService, private _requestService: RequestService) { 
 
  }

  ngOnInit(): void {
  }
  trackByFn(index: any) {
    return index;
  }  
  getLoanStatusColor(status: string) {
    if (status == "Approved" || status == "Funded" || status == "Completed") return 'success';
    if (status == "NotQualified" || status == "Declined" || status == "Defaulting") return 'danger';
    return status == "Processing" ? '' : 'info';
  }
  changeFilter(value: any) {
    this.activate(value);
    this._loanService.filterSubject.next(value);
  }
  activate(value: string) {
    this.activeFilterSubject.next(value);
  }

  selectLoanEvent(id:number){
    this.selectLoan.emit(id);
  }
}
