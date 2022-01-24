import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import moment = require('moment');
import { Observable, BehaviorSubject, from, Subject, Subscription } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { DocumentService } from 'src/app/shared/services/document/document.service';
import { DisbursedLoanService } from 'src/app/shared/services/loan/disbursedLoan/disbursed-loan.service';
import { RepaymentService } from 'src/app/shared/services/repayment/repayment.service';
import { NotifyService } from '../../notify/notify.service';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-loan-request',
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.scss']
})
export class LoanRequestComponent implements OnInit {
  loans$: Observable<any[]>;
  notifyForm: FormGroup;
  fForm: FormGroup;
  uForm: FormGroup;
  sform: FormGroup;
  messageTypes: any[] = [{ label: "Announcements" }, { label: "Update" }];
  loanStatuses: any[] = [{ label: "Processing", key: "processing" }, { label: "UpdateRequired", key: "update" }, { label: "Declined", key: "declined" }, { label: "Approved", key: "approved" }, { label: "Funded", key: "funded" }];
  ctrl: FormControl = new FormControl("");
  @Input()
  fromDate: FormControl = new FormControl(moment().startOf("day").subtract(1, "month").format('yyyy-MM-dd'));

  @Input()
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
  enterUpdateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enterUpdate$: Observable<boolean> = this.enterUpdateSubject.asObservable();
  enterSerialNumberSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enterSerialNumber$: Observable<boolean> = this.enterSerialNumberSubject.asObservable();

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
  get mailMessage() {
    return this.fForm.get("mailMessage") as FormControl || new FormControl();
  }
  get uMailMessage() {

    return this.uForm.get("mailMessage") as FormControl || new FormControl();
  }
  get serialNumber() {
    return this.sform.get("serialNumber") as FormControl || new FormControl();
  }
  constructor(private _fb: FormBuilder, private _documentService: DocumentService, private _notifyService: NotifyService, private _utilityService: Utility, private _requestService: RequestService, private _disbursedLoanService: DisbursedLoanService, private _repaymentService: RepaymentService) {
    this.loanDetails$ = this._requestService.loanDetails$;
  }

  ngOnInit(): void {

    this.loans$ = this._requestService.filteredRequests$;
    this.repayments$ = this._repaymentService.repayments$;
    this.ctrl.valueChanges.subscribe(c => {
      this.showConfirmSubject.next(true);
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
      mailMessage: [""]
    });
    this.sform = this._fb.group({
      serialNumber: [0, [Validators.required]],
    });
    this.uForm = this._fb.group({
      mailMessage: [""]
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
    const skip=["processing","notqualified","declined" ,"updaterequired"]
    if (!skip.includes(c.toLowerCase())) {
      this._requestService.updateStatus(this._requestService.selectedIdSubject.value, c, '', "",undefined).then(response => {
        this.loadingSubject.next(false)
        this._utilityService.setSuccess("Successfully updated status and sent email to customer")
        this._requestService.updateSearch(this.getCriteria(this.fromDate.value, this.toDate.value))
      });
    } else {
      switch (c.toLowerCase()) {
        case "updaterequired":
          this.enterUpdateSubject.next(true)
          break;
        case "processing":
          this.enterSerialNumberSubject.next(true)
          break;
        default:
          this.enterFailureSubject.next(true);
          break;
      }
    }
    setTimeout(() => this.showConfirmSubject.next(false), 0);
  }
  proceed() {
    // if(this.ctrl.value=="NotQualified"){this.enterFailureSubject.next(true)}
    this.loadingSubject.next(true)
    this._requestService.updateStatus(this._requestService.selectedIdSubject.value, this._requestService.getStatus(this.lastStatusSubject.value), this.lastStatusSubject.value.toLowerCase() == "updaterequired" ? undefined : this.failureReason.value, this.lastStatusSubject.value.toLowerCase() == "updaterequired" ? this.uMailMessage.value : this.mailMessage.value,this.serialNumber.value).then(response => {
      this.loadingSubject.next(false)
      this._utilityService.setSuccess("Successfully updated status and sent email to customer")
      this._requestService.updateSearch(this.getCriteria(this.fromDate.value, this.toDate.value))
    }).catch(err => {
      this.loadingSubject.next(false)
      this._utilityService.setError(err)
    });
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
    // this.proceed();
    this.enterFailureSubject.next(false);
  }
  closeUpdateModal() {
    // this.proceed();
    this.enterUpdateSubject.next(false);
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
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.repay(id, this._requestService.selectedIdSubject.value, this._utilityService.convertToPlainNumber(this.amount.value));

    this.loadingSubject.next(true);
  }


  onNotify(form: FormGroup, code: string, customerId: number) {

    // stop here if form is invalid
    if (form.invalid) {
      return;
    }

    this.notify(this.message.value, this.messageType.value, [customerId], code);

    this.loadingSubject.next(true);
  }


  onFailure(event: any) {
    this.proceed();
    this.enterFailureSubject.next(false);
    this.showSubject.next(false)
  }

  onUpdateRequired(event: any) {
    this.proceed();
    this.enterUpdateSubject.next(false);
    this.showSubject.next(false)
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
  download(url: string, filename: string) {
    this._documentService.download(url, filename)
  }
  closeSerialNumber() {
    this.enterSerialNumberSubject.next(false);
  }
  onSerialNumberEntered(event: any) {
    this.proceed();
    this.enterSerialNumberSubject.next(false);
    this.showSubject.next(false)
  }
}
