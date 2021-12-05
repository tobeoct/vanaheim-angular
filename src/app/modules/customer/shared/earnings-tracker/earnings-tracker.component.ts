import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VCValidators } from '@validators/default.validators';
import moment = require('moment');
import { Observable, BehaviorSubject } from 'rxjs';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AdminEarningService } from 'src/app/shared/services/earning/admin-earning.service';
import { EarningPayoutService } from 'src/app/shared/services/earning/earning-payout.service';
import { EarningService } from 'src/app/shared/services/earning/earning.service';

@Component({
  selector: 'app-earnings-tracker',
  templateUrl: './earnings-tracker.component.html',
  styleUrls: ['./earnings-tracker.component.scss']
})
export class EarningsTrackerComponent implements OnInit {

  @Input()
  earnings:any

  @Input()
  showHistory:boolean =false;

  @Input()
  size:string ="lg"

  @Input()
  index:number
  approvedEarnings$: Observable<any>;
  constructor(private _router: Router,private _earningService: EarningService, private _earningPayoutService: EarningPayoutService, private _requestService: AdminEarningService, private _utils: Utility) { }

  ngOnInit(): void {
    
    this.approvedEarnings$ = this._requestService.allEarningDetails$;
  }
  trackByFn(index: any, item: any) {
    return index;
  }
  
  getDaysLeft(date: any) {
    let d = moment(date);
    let now = moment();
    return d.diff(now, "days");
  }

  getNextDueDateFormatted(dateFunded: any, tenure: number, denominator: string) {
    return this._earningService.getNextDueDateFormatted(dateFunded, tenure, denominator);
  }
  onNavigate(route: string, params: any = {}): void {
    this._router.navigate([route], { queryParams: params })
  }
}
