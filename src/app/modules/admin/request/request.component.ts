import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import moment = require('moment');
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { DisbursedLoanService } from 'src/app/shared/services/loan/disbursedLoan/disbursed-loan.service';
import { RepaymentService } from 'src/app/shared/services/repayment/repayment.service';
import { NotifyService } from '../notify/notify.service';
import { RequestService } from './request.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  loans$: Observable<any[]>;
  notifyForm: FormGroup;
  fForm: FormGroup;
  messageTypes: any[] = [{ label: "Announcements" }, { label: "Update" }];
  loanStatuses: any[] = [{ label: "Pending", key: "new" }, { label: "Processing", key: "processing" }, { label: "UpdateRequired", key: "update" }, { label: "Declined", key: "declined" }, { label: "Approved", key: "approved" }, { label: "Funded", key: "funded" }];
  ctrl: FormControl = new FormControl("");
  fromDate: FormControl = new FormControl(moment().startOf("day").subtract(1, "month").format('yyyy-MM-dd'));
  toDate: FormControl = new FormControl(moment().endOf("day").format('yyyy-MM-dd'));

  allSubscriptions: Subscription[] = [];

  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();

  showRepaymentSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showRepayment$: Observable<boolean> = this.showRepaymentSubject.asObservable();

  showConfirmSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showConfirm$: Observable<boolean> = this.showConfirmSubject.asObservable();

  showNotifySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showNotify$: Observable<boolean> = this.showNotifySubject.asObservable();

  indicatorSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  indicator$: Observable<string> = this.indicatorSubject.asObservable();

  lastStatusSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  lastStatus$: Observable<string> = this.lastStatusSubject.asObservable();

  repayments$: Observable<any>

  loanDetails$: Observable<any>
  form: FormGroup;
  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(3000));
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();

  apiSuccessSubject: Subject<string> = new Subject<string>();
  apiSuccess$: Observable<string> = this.apiSuccessSubject.asObservable();

  apiErrorSubject: Subject<string> = new Subject<string>();
  apiError$: Observable<string> = this.apiErrorSubject.asObservable();

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  enterFailureSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enterFailure$: Observable<boolean> = this.enterFailureSubject.asObservable();
  get amount() {
    return this.form.get("amount") as FormControl || new FormControl();
  }
  get message() {
    return this.notifyForm.get("message") as FormControl || new FormControl();
  }
  get messageType() {
    return this.notifyForm.get("messageType") as FormControl || new FormControl();
  }
  get failureReason() {
    return this.fForm.get("failureReason") as FormControl || new FormControl();
  }
  constructor(private _fb: FormBuilder, private _notifyService: NotifyService, private _utilityService: Utility, private _requestService: RequestService, private _disbursedLoanService: DisbursedLoanService, private _repaymentService: RepaymentService) {
    this.loanDetails$ = this._requestService.loanDetails$;
  }

  ngOnInit(): void {

    this.loans$ = this._requestService.filteredRequests$;
    this.repayments$ = this._repaymentService.repayments$;
    this.ctrl.valueChanges.subscribe(c => {
      this.showConfirmSubject.next(true);
    })
    this.fromDate.valueChanges.subscribe(d => {
      this._requestService.updateSearch(this.getCriteria(d, this.toDate.value));
    })
    this.toDate.valueChanges.subscribe(d => {
      this._requestService.updateSearch(this.getCriteria(this.fromDate.value, d));
    })
    this.form = this._fb.group({
      amount: ["", [Validators.required]]
    });
    this.notifyForm = this._fb.group({
      message: ["", [Validators.required]],
      messageType: ["", [Validators.required]]
    });
    this.fForm = this._fb.group({
      failureReason: [""],
    });
  }
  getCriteria(from: any, to: any) {
    return { from: moment(from).startOf("day").toDate(), to: moment(to).endOf("day").toDate() };
  }
  confirm() {
    const c = this.ctrl.value;
    this.lastStatusSubject.next(c);
    const indicator = this.loanStatuses.find(l => l.label == c)?.key;
    this.indicatorSubject.next(indicator);
    console.log("Confirm Value",c)
    if (c.toLowerCase()!= "notqualified" && c.toLowerCase()!= "declined") {
      this._requestService.updateStatus(this._requestService.selectedIdSubject.value, c,'');
    } else {
      this.enterFailureSubject.next(true);
    }
    setTimeout(() => this.showConfirmSubject.next(false), 0);
  }
  proceed(){
    // if(this.ctrl.value=="NotQualified"){this.enterFailureSubject.next(true)}
    this._requestService.updateStatus(this._requestService.selectedIdSubject.value, this.lastStatusSubject.value, this.failureReason.value);
  }
  selectLoan({ id, indicator }: any) {
    this._requestService.selectLoan(id);
    this.indicatorSubject.next(indicator);
    this.showSubject.next(true);
    this.lastStatusSubject.next(this.ctrl.value);
  }

  closeModal() {
    this.showSubject.next(false);
  }
  showRepayment(id: number) {
    this.showRepaymentSubject.next(true);
    this._repaymentService.selectLoan(id);
  }
  closeRepayment() {
    this.showRepaymentSubject.next(false);
  }
  showNotify() {
    this.showNotifySubject.next(true);
  }
  closeNotify() {
    this.showNotifySubject.next(false);
  }
  closeConfirmModal() {
    this.ctrl.patchValue(this.lastStatusSubject.value);
    setTimeout(() => { this.showConfirmSubject.next(false); }, 0);
  }
  closeFailureModal() {
    this.proceed();
    this.enterFailureSubject.next(false);
  }
  trackByFn(index: number, item: any) {
    return index;
  }
  getStatusColor(status: string) {
    if (status == "Paid In Full" || status == "Fully Paid") return 'success';
    return status == "Defaulted" ? 'danger' : status == 'Partial' ? 'info' : '';
  }

  focus() {
    this.focusSubject.next(true)
  }
  ngAfterViewInit(): void {
    const sub = this.delay$.subscribe(c => {
      this.focus();
    })
    this.allSubscriptions.push(sub);
  }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(sub => sub.unsubscribe());
  }
  onSubmit(form: FormGroup, id: number) {
    console.log("Submitting");
    // stop here if form is invalid
    if (form.invalid) {
      console.log("Form Invalid");
      return;
    }
    this.repay(id, this._requestService.selectedIdSubject.value, this._utilityService.convertToPlainNumber(this.amount.value));

    this.loadingSubject.next(true);
  }


  onNotify(form: FormGroup, code: string, customerId: number) {
    console.log("Submitting");
    // stop here if form is invalid
    if (form.invalid) {
      console.log("Form Invalid");
      return;
    }

    this.notify(this.message.value, this.messageType.value, [customerId], code);

    this.loadingSubject.next(true);
  }


  onFailure(form: FormGroup) {
    this.proceed();
    this.enterFailureSubject.next(false);
  }

  repay(disbursedLoanId: number, loanRequestId: number, amount: number) {
    const sub = this._repaymentService.repay(disbursedLoanId, loanRequestId, amount)
      .pipe(first())
      .subscribe(
        response => {
          this.loadingSubject.next(false);
          this.apiSuccessSubject.next(response);
          this._repaymentService.selectLoan(disbursedLoanId)
          setTimeout(() => { this.apiSuccessSubject.next(); }, 5000)
        },
        error => {
          setTimeout(() => { this.apiErrorSubject.next("Error: " + error); this.loadingSubject.next(false); }, 1000)
          setTimeout(() => { this.apiErrorSubject.next(); }, 5000)
        });
    this.allSubscriptions.push(sub);
  }
  notify(message: string, type: string, customerID: number[], code: string) {
    const sub = this._notifyService.notify({ message, type, customerID, code })
      .pipe(first())
      .subscribe(
        response => {
          this.loadingSubject.next(false);
          this.apiSuccessSubject.next(response);
          setTimeout(() => { this.apiSuccessSubject.next(); }, 5000)
        },
        error => {
          setTimeout(() => { this.apiErrorSubject.next("Error: " + error); this.loadingSubject.next(false); }, 1000)
          setTimeout(() => { this.apiErrorSubject.next(); }, 5000)
        });
    this.allSubscriptions.push(sub);
  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }
}
