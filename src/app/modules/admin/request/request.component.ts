import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import moment = require('moment');
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { DisbursedLoanService } from 'src/app/shared/services/loan/disbursedLoan/disbursed-loan.service';
import { RepaymentService } from 'src/app/shared/services/repayment/repayment.service';
import { RequestService } from './request.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  loans$: Observable<any[]>;

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

  get amount() {
    return this.form.get("amount") as FormControl || new FormControl();
  }
  constructor(private _fb: FormBuilder, private _utilityService: Utility, private _requestService: RequestService, private _disbursedLoanService: DisbursedLoanService, private _repaymentService: RepaymentService) {
    this.loanDetails$ = this._requestService.loanDetails$;
  }

  ngOnInit(): void {

    this.loans$ = this._requestService.filteredRequests$;
    // this._repaymentService.selectLoan(2);
    // this._repaymentService.repayments$.subscribe(c=>console.log(c))
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
  }
  getCriteria(from: any, to: any) {
    return { from: moment(from).startOf("day").toDate(), to: moment(to).endOf("day").toDate() };
  }
  confirm() {
    const c = this.ctrl.value;
    this.lastStatusSubject.next(c);
    const indicator = this.loanStatuses.find(l => l.label == c)?.key;
    this.indicatorSubject.next(indicator);
    this._requestService.updateStatus(this._requestService.selectedIdSubject.value, c)
    setTimeout(() => this.showConfirmSubject.next(false), 0);
  }
  selectLoan({ id, indicator }: any) {
    this._requestService.selectLoan(id);
    // this._disbursedLoanService.selectLoan(id);
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
  closeConfirmModal() {
    this.ctrl.patchValue(this.lastStatusSubject.value);
    setTimeout(() => this.showConfirmSubject.next(false), 0);
  }
  trackByFn(index: number, item: any) {
    return index;
  }
  getStatusColor(status: string) {
    if (status == "Paid In Full") return 'success';
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

  repay(disbursedLoanId: number, loanRequestId: number, amount: number) {
    const sub = this._repaymentService.repay(disbursedLoanId, loanRequestId, amount)
      .pipe(first())
      .subscribe(
        response => {
          this.loadingSubject.next(false);
          this.apiSuccessSubject.next(response.data);
          this._repaymentService.selectLoan(disbursedLoanId)
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
