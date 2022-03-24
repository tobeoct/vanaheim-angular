import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestService } from 'src/app/modules/admin/request/request.service';
import { EarningService } from 'src/app/shared/services/earning/earning.service';

@Component({
  selector: 'app-earning-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class EarningReportComponent implements OnInit {

  @Input()
  earnings:any

  @Output()
  selectEarning:EventEmitter<any> = new EventEmitter<any>()
  pagingSubject: BehaviorSubject<any>;
  totalEarnings: any[] = [];
  
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();

  activeFilterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeFilter$: Observable<string> = this.activeFilterSubject.asObservable();
  constructor(private _route: ActivatedRoute, private _earningService: EarningService, private _requestService: RequestService) { 
 
    this.pagingSubject = this._earningService.pagingSubject;
  }

  ngOnInit(): void {
  }
  trackByFn(index: any) {
    return index;
  }  
  getEarningStatusColor(status: string) {
    if (status == "Active" || status == "Matured" || status == "Completed") return 'success';
    if (status == "NotQualified" || status == "Declined" || status == "Defaulting") return 'danger';
    return status == "Processing" || status == 'TopUpRequest' || status == 'LiquidationRequest' ? '' : 'info';
  }

  getStatusColor(status: string) {
    if (status == "Paid In Full" || status == "Fully Paid") return 'success';
    return status == "Defaulted" ? 'danger' : status == 'Partial' ? 'info' : '';
  }
  changeFilter(value: any) {
    this.activate(value);
    this._earningService.filterSubject.next(value);
  }
  activate(value: string) {
    this.activeFilterSubject.next(value);
  }

  selectEarningEvent(id:number){
    this.selectEarning.emit(id);
  }

}
