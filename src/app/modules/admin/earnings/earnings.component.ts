import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import moment = require('moment');
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AdminEarningService } from 'src/app/shared/services/earning/admin-earning.service';
import { EarningPayoutService } from 'src/app/shared/services/earning/earning-payout.service';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent implements OnInit {
  form: FormGroup;
  liquidations$: Observable<any>
  topUps$: Observable<any>
  @Input()
  fromDate: FormControl = new FormControl(moment().startOf("day").subtract(1, "month").format('yyyy-MM-dd'));

  @Input()
  toDate: FormControl = new FormControl(moment().endOf("day").format('yyyy-MM-dd'));

  topUpPagingSubject: BehaviorSubject<any>;
  liquidationPagingSubject: BehaviorSubject<any>;
  constructor(private _requestService: AdminEarningService, private _fb: FormBuilder, private _earningsPayoutService: EarningPayoutService, private _utils: Utility) { }

  ngOnInit(): void {
    this.fromDate.valueChanges.subscribe(d => {
      this._requestService.updateSearch(this.getCriteria(d, this.toDate.value));
    })
    this.toDate.valueChanges.subscribe(d => {
      this._requestService.updateSearch(this.getCriteria(this.fromDate.value, d));
    })

    this.topUpPagingSubject = new BehaviorSubject<any>({ pageNumber: 1, maxSize: 100 });
    this.liquidationPagingSubject = new BehaviorSubject<any>({ pageNumber: 1, maxSize: 100 });
    this.topUps$ = this._requestService.getTopUps();
    this.liquidations$ = this._requestService.getLiquidations();
  }
  getCriteria(from: any, to: any) {
    return { from: moment(from).startOf("day").toDate(), to: moment(to).endOf("day").toDate() };
  }
  getEarningStatusColor(status: string) {
    if (status == "Active" || status == "Matured" || status == "Completed") return 'success';
    if (status == "NotQualified" || status == "Declined" || status == "Defaulting") return 'danger';
    return status == "Processing" || status == 'TopUpRequest' || status == 'LiquidationRequest' ? '' : 'info';
  }

  topUp(id: number) {
    this._utils.toggleLoading(true);
    this._requestService.topUp(id).subscribe(c => {
      this._utils.setSuccess(c);
      this.topUps$ = this._requestService.getTopUps();
    }, error => {
      this._utils.setError(error);

    })
  }
  declineTopUp(id: number) {

  }
  liquidate(id: number, status: string) {
    this._utils.toggleLoading(true);
    this._requestService.liquidate(id, status).subscribe(c => {
      this._utils.setSuccess(c);
      this.liquidations$ = this._requestService.getLiquidations();
    }, error => {
      this._utils.setError(error);

    })
  }
  trackByFn(index: any, item: any) {
    return index;
  }
}
