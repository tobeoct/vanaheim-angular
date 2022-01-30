import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VCValidators } from '@validators/default.validators';
import moment = require('moment');
import { Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { DocumentService } from 'src/app/shared/services/document/document.service';
import { AdminEarningService } from 'src/app/shared/services/earning/admin-earning.service';
import { EarningPayoutService } from 'src/app/shared/services/earning/earning-payout.service';
import { EarningService } from 'src/app/shared/services/earning/earning.service';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent implements OnInit {
  topUpForm: FormGroup;
  liquidationForm: FormGroup;
  @ViewChild('applyNow') applyNow: ElementRef;
  earnings$: Observable<any>;
  activeEarnings: boolean = false;
  totalEarnings: any[] = [];
  disbursedEarning$: Observable<any>;
  totalRepaymentSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalRepayment$: Observable<number> = this.totalRepaymentSubject.asObservable();

  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();

  base: string;
  loanRequestID: number
  loanRequestLogID: number
  get topUpAmount(): FormControl {
    return this.topUpForm.get("amount") as FormControl || new FormControl(0)
  }
  get liquidationAmount(): FormControl {
    return this.liquidationForm.get("amount") as FormControl || new FormControl(0)
  }
  get payoutDate(): FormControl {
    return this.liquidationForm.get("payoutDate") as FormControl || new FormControl(0)
  }
  pagingSubject: BehaviorSubject<any>;
  latestEarnings$: Observable<any[]>;
  runningEarning$: Observable<any>;
  approvedEarnings$: Observable<any>;
  earningPayouts$: Observable<any[]>;
  activeFilterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeFilter$: Observable<string> = this.activeFilterSubject.asObservable();

  payouts$: Observable<any[]>
  showPayoutSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showPayout$: Observable<boolean> = this.showPayoutSubject.asObservable();
  earningDetailsFromDb$: Observable<any>
  requestIDSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showTopUpSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showTopUp$: Observable<boolean> = this.showTopUpSubject.asObservable();


  showLiquidationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showLiquidation$: Observable<boolean> = this.showLiquidationSubject.asObservable();
  constructor(private _route: ActivatedRoute, private _fb: FormBuilder, private _documentService: DocumentService, private _validators: VCValidators, private _earningService: EarningService, private _earningPayoutService: EarningPayoutService, private _requestService: AdminEarningService, private _utils: Utility) { }

  ngOnInit(): void {
    this._route.params
      .subscribe(params => {
        const id = +params['id'];
        if (id && id > 0) {
          this.selectEarning(id);
        }
      });
    this.earningDetailsFromDb$ = this._requestService.earningLogDetails$;
    this.latestEarnings$ = this._earningService.latestEarnings$;
    this.runningEarning$ = this._earningService.runningEarning$;
    this.approvedEarnings$ = this._requestService.allEarningDetails$;
    this.earningPayouts$ = this._earningPayoutService.myEarningPayouts$;
    this.earnings$ = this._earningService.earningWithFilter$;
    this.pagingSubject = this._earningService.pagingSubject;
    this.topUpForm = this._fb.group({
      amount: ["10,000", [Validators.required, this._validators.numberRange(10000, 10000000)]]
    })

    this.liquidationForm = this._fb.group({
      amount: ["10,000", [Validators.required, this._validators.numberRange(10000, 20000000)]],
      payoutDate: ["", [Validators.required]]
    })
  }
  moveToApply(): void {
    this.applyNow.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
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
  trackByFn(index: any, item: any) {
    return index;
  }
  close() {
    this.showSubject.next(false);
  }
  selectEarning(id: number) {
    this._requestService.selectEarningLog(id);
    this.showSubject.next(true);
  }
  closePayout() {
    this.showPayoutSubject.next(false);
  }
  showPayouts(id: number) {
    console.log("Show payouts")
    this.payouts$ = this._earningPayoutService.getEarningPayout(id)
    this.showPayoutSubject.next(true);
    this._earningPayoutService.selectEarning(id);
  }

  liquidate(requestID: number) {

    this.requestIDSubject.next(requestID);
    this.showLiquidationSubject.next(true)

  }

  topUp(requestID: number) {
    this.requestIDSubject.next(requestID);
    this.showTopUpSubject.next(true)
  }
  notifyLiquidation(form: any) {
    const requestID = this.requestIDSubject.value;
    const amount = this.liquidationAmount.value;
    const payoutDate = this.payoutDate.value;
    this._utils.toggleLoading(true);
    this._earningService.notifyLiquidate(requestID, amount, payoutDate).pipe(take(1)).subscribe(
      data => {

        this._utils.setSuccess(data);
        this.showLiquidationSubject.next(false)
        this._requestService.selectEarningLog(requestID);
        this.showSubject.next(false);

      },
      (error: string) => {
        if (error == "Not Found") error = "You do not seem to be connected to the internet";

        this._utils.setError(error)

      });
  }
  notifyTopUp(form: any) {
    const requestID = this.requestIDSubject.value;
    const amount = this.topUpAmount.value;
    this._utils.toggleLoading(true);
    this._earningService.notifyTopUp(requestID, amount).pipe(take(1)).subscribe(
      data => {

        setTimeout(() => {
          this._utils.setSuccess(data);
          this.showTopUpSubject.next(false);
          this._requestService.selectEarningLog(requestID);
          this.showSubject.next(false);
        }, 0);

      },
      (error: string) => {
        if (error == "Not Found") error = "You do not seem to be connected to the internet";
        setTimeout(() => { this._utils.setError(error) }, 0);

      });

  }

  getDaysLeft(date: any) {
    let d = moment(date);
    let now = moment();
    return d.diff(now, "days");
  }

  getNextDueDateFormatted(dateFunded: any, tenure: number, denominator: string) {
    return this._earningService.getNextDueDateFormatted(dateFunded, tenure, denominator);
  }
  changeFilter(value: any) {
    // this.activate(value);
    this._earningService.filterSubject.next(value);
  }
  closeTopUpModal() {
    this.showTopUpSubject.next(false)
  }
  closeLiquidationModal() {
    this.showLiquidationSubject.next(false)
  }

  onError(err: any) {

  }
  download(url: string, filename: string) {

    this._documentService.download(url, filename)
  }

}
