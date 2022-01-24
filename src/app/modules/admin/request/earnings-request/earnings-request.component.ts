import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import moment = require('moment');
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { DocumentService } from 'src/app/shared/services/document/document.service';
import { AdminEarningService } from 'src/app/shared/services/earning/admin-earning.service';
import { EarningPayoutService } from 'src/app/shared/services/earning/earning-payout.service';

@Component({
  selector: 'app-earnings-request',
  templateUrl: './earnings-request.component.html',
  styleUrls: ['./earnings-request.component.scss']
})
export class EarningsRequestComponent implements OnInit {
  earnings$: Observable<any[]>;
  fForm: FormGroup;
  form: FormGroup;
  pform: FormGroup;
  sform: FormGroup;
  @Input()
  fromDate: FormControl = new FormControl(moment().startOf("day").subtract(1, "month").format('yyyy-MM-dd'));

  @Input()
  toDate: FormControl = new FormControl(moment().endOf("day").format('yyyy-MM-dd'));
  ctrl: FormControl = new FormControl("");
  messageTypes: any[] = [{ label: "Announcements" }, { label: "Update" }];
  earningsStatuses: any[] = [{ label: "Processing", key: "processing" },
  //  { label: "Declined", key: "declined" },
  { label: "Active", key: "active" }];

  payouts$: Observable<any>
  earningDetails$: Observable<any>
  showPayoutSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showPayout$: Observable<boolean> = this.showPayoutSubject.asObservable();
  allSubscriptions: Subscription[] = [];

  indicatorSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  indicator$: Observable<string> = this.indicatorSubject.asObservable();

  lastStatusSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  lastStatus$: Observable<string> = this.lastStatusSubject.asObservable();

  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();

  showConfirmSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showConfirm$: Observable<boolean> = this.showConfirmSubject.asObservable();

  showNotifySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showNotify$: Observable<boolean> = this.showNotifySubject.asObservable();

  earningsDetails$: Observable<any>

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  enterFailureSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enterFailure$: Observable<boolean> = this.enterFailureSubject.asObservable();
  enterStartDateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enterStartDate$: Observable<boolean> = this.enterStartDateSubject.asObservable();
  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(3000));


  enterSerialNumberSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enterSerialNumber$: Observable<boolean> = this.enterSerialNumberSubject.asObservable();

  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();

  get failureReason() {
    return this.fForm.get("failureReason") as FormControl || new FormControl();
  }
  get mailMessage() {
    return this.fForm.get("mailMessage") as FormControl || new FormControl();
  }
  get startDate() {
    return this.form.get("start") as FormControl || new FormControl();
  }
  get amount() {
    return this.pform.get("amount") as FormControl || new FormControl();
  }
  get serialNumber() {
    return this.sform.get("serialNumber") as FormControl || new FormControl();
  }
  constructor(private _requestService: AdminEarningService, private _documentService: DocumentService, private _fb: FormBuilder, private _earningsPayoutService: EarningPayoutService, private _utils: Utility) { }

  ngOnInit(): void {
    this.fForm = this._fb.group({
      failureReason: [""],
      mailMessage: [""]
    });
    this.form = this._fb.group({
      start: [moment().toDate(), [Validators.required]],
    });
    this.pform = this._fb.group({
      amount: ["", [Validators.required]]
    });
    this.sform = this._fb.group({
      serialNumber: ["", [Validators.required]],
    });
    this.earningsDetails$ = this._requestService.earningDetails$;
    this.earnings$ = this._requestService.filteredRequests$;
  }
  selectEarning({ id, indicator }: any) {
    this._requestService.selectEarning(id);
    this.indicatorSubject.next(indicator);
    this.showSubject.next(true);
    this.lastStatusSubject.next(this.ctrl.value);
  }
  confirm() {
    const c = this.ctrl.value;
    this.lastStatusSubject.next(c);
    const indicator = this.earningsStatuses.find(l => l.label == c)?.key;
    this.indicatorSubject.next(indicator);
    const skip = ["declined", "active", "processing"]
    if (!skip.includes(c.toLowerCase())) {
      this._requestService.updateStatus(this._requestService.selectedIdSubject.value, c, '', "", null, null).then(response => {
        this.loadingSubject.next(false)
        this._utils.setSuccess("Successfully updated status and sent email to customer")
        this._requestService.updateSearch(this.getCriteria(this.fromDate.value, this.toDate.value))
      });
    } else {
      switch (c.toLowerCase()) {
        case "active":
          this.enterStartDateSubject.next(true);
          break;
        case "processing":
          this.enterSerialNumberSubject.next(true);
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
    this._requestService.updateStatus(this._requestService.selectedIdSubject.value, this._requestService.getStatus(this.lastStatusSubject.value), this.lastStatusSubject.value.toLowerCase() == "active" ? undefined : this.failureReason.value, this.mailMessage.value, this.startDate.value, this.serialNumber.value).then(response => {
      this.loadingSubject.next(false)
      this._utils.setSuccess("Successfully updated status and sent email to customer")
      this._requestService.updateSearch(this.getCriteria(this.fromDate.value, this.toDate.value))
    }).catch(err => {
      this.loadingSubject.next(false)
      this._utils.setError(err)
    });
  }
  getCriteria(from: any, to: any) {
    return { from: moment(from).startOf("day").toDate(), to: moment(to).endOf("day").toDate() };
  }
  closeModal() {
    this.showSubject.next(false);
  }
  onFailure(event: any) {
    this.proceed();
    this.enterFailureSubject.next(false);
    this.showSubject.next(false)
  }
  download(url: string, filename: string) {

    this._documentService.download(url, filename)
  }
  closeFailureModal() {
    // this.proceed();
    this.enterFailureSubject.next(false);
  }
  closeStartDateModal() {
    // this.proceed();
    this.enterStartDateSubject.next(false);
  }
  showPayouts(id: number) {
    console.log("Show payouts")
    this.payouts$ = this._earningsPayoutService.getEarningPayout(id)
    this.showPayoutSubject.next(true);
    this._earningsPayoutService.selectEarning(id);
  }
  trackByFn(index: number, item: any) {
    return index;
  }
  showNotify() {
    this.showNotifySubject.next(true);
  }
  closeNotify() {
    this.showNotifySubject.next(false);
  }
  onError(value: any): void {
    // this.errorMessageSubject.next(value);
  }
  onStartDate(event: any) {
    this.proceed();
    this.enterStartDateSubject.next(false);
    this.showSubject.next(false)
  }
  closePayout() {
    this.showPayoutSubject.next(false);
  }
  getStatusColor(status: string) {
    if (status == "Paid In Full" || status == "Fully Paid") return 'success';
    return status == "Defaulted" ? 'danger' : status == 'Partial' ? 'info' : '';
  }
  pay(approvedEarningId: number, earningRequestId: number, amount: number) {
    this._utils.toggleLoading(true)
    const sub = this._earningsPayoutService.pay(approvedEarningId, earningRequestId, amount)
      .pipe(first())
      .subscribe(
        response => {
          this._utils.setSuccess(response);
          this._earningsPayoutService.selectEarning(approvedEarningId)
          this.payouts$ = this._earningsPayoutService.getEarningPayout(approvedEarningId)
        },
        error => {
          setTimeout(() => { this._utils.setError("Error: " + error); }, 1000)
        });
    this.allSubscriptions.push(sub);
  }

  onSubmit(form: FormGroup, id: number) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.pay(id, this._requestService.selectedIdSubject.value, this._utils.convertToPlainNumber(this.amount.value));

    // this.loadingSubject.next(true);
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
