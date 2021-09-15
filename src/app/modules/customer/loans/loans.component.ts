import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { VCValidators } from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, Observable, from, Subject, Subscription } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { AssetPath } from 'src/app/shared/constants/variables';
import { IAssetPath } from 'src/app/shared/interfaces/assetpath';
import { Store } from 'src/app/shared/helpers/store';
import { LoanService } from 'src/app/shared/services/loan/loan.service';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { LoanDetails } from '../../loan/shared/loan-calculator/loan-details';
import { RequestService } from '../../admin/request/request.service';
import moment = require('moment');
import { RepaymentService } from 'src/app/shared/services/repayment/repayment.service';
import { DocumentService } from 'src/app/shared/services/document/document.service';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoansComponent implements OnInit, OnDestroy {

  @ViewChild('applyNow') applyNow: ElementRef;
  form: FormGroup;
  assetPaths: IAssetPath = new AssetPath;
  activeLoan: boolean = false;
  totalLoans: any[] = [];
  loanCalculator: any;
  requirements: any
  uploadedDocument: FormControl = new FormControl();
  requirementCtrl: FormControl = new FormControl();
  get loanType() {
    return this.form.get("loanType") as FormControl || new FormControl();
  }
  get purpose() {
    return this.form.get("purpose") as FormControl || new FormControl();
  }
  get loanAmount() {
    return this.form.get("loanAmount") as FormControl || new FormControl();
  }

  get tenure() {
    return this.form.get("tenure") as FormControl || new FormControl();
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  loanProducts: any[]
  loanDetailsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loanDetails$: Observable<any> = this.loanDetailsSubject.asObservable();
  loanDetailsFromDb$: Observable<any>
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

  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();
  rate: number;
  minTenure: number = 1;
  maxTenure: number = 12;
  range: any;
  tenureDenominator: string = "Mos";
  loanDetails: LoanDetails;
  monthlyRepaymentSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  monthlyRepayment$: Observable<number> = this.monthlyRepaymentSubject.asObservable();
  loans$: Observable<any>;
  disbursedLoan$: Observable<any>;
  totalRepaymentSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalRepayment$: Observable<number> = this.totalRepaymentSubject.asObservable();

  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();

  base: string;

  pagingSubject: BehaviorSubject<any>;
  latestLoan$: Observable<any>;
  runningLoan$: Observable<any>;
  repayments$: Observable<any[]>;

  showRepaymentSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showRepayment$: Observable<boolean> = this.showRepaymentSubject.asObservable();
  tenureDenominatorSubject: BehaviorSubject<string> = new BehaviorSubject<string>("Mos");
  tenureDenominator$: Observable<string> = this.tenureDenominatorSubject.asObservable();

  showUploadSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showUpload$: Observable<boolean> = this.showUploadSubject.asObservable();
  loanRequestID: number

  requirementSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  requirement$: Observable<any> = this.requirementSubject.asObservable();
  latestLoanSubscription: Subscription;
  activeFilterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeFilter$: Observable<string> = this.activeFilterSubject.asObservable();
  constructor(private _fb: FormBuilder, private _documentService: DocumentService, private _repaymentService: RepaymentService, private _store: Store, private _utility: Utility,
    private _router: Router,
    private _validators: VCValidators,
    private _loanService: LoanService, private _requestService: RequestService) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url + '/';
    });
    this.loanProducts = this._store.loanProducts;
  }
  ngOnDestroy(): void {

    if (this.latestLoanSubscription) this.latestLoanSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this.loanDetails = this._store.loanCalculator as LoanDetails;
    this.loanDetailsFromDb$ = this._requestService.loanLogDetails$;
    this.disbursedLoan$ = this._requestService.loanDetails$;
    this.loanCalculator = this._store.loanCalculator;
    this.loanDetailsSubject.next(this._store.loanCalculator)
    this.latestLoan$ = this._loanService.latestLoan$;
    this.runningLoan$ = this._loanService.runningLoan$;
    this.repayments$ = this._repaymentService.myRepayments$;

    this.requirementCtrl.valueChanges.subscribe(c => {
      this.requirementSubject.next(this.requirements[+c])
      console.log(this.requirementSubject.value)
    })
    this.latestLoanSubscription = this.latestLoan$.subscribe(l => {
      if (l.requestStatus == 'Funded') {
        this._requestService.selectLoan(l.id);
      }
    })
    this.loans$ = this._loanService.loanWithFilter$;
    let lType = this._store.loanType || "PayMe Loan";
    let tenureRange = this._loanService.getTenureRange(lType);
    this.minTenure = tenureRange["min"];
    this.maxTenure = tenureRange["max"];
    this._store.titleSubject.next("Loan Calculator");
    this.range = this._loanService.getMinMax(lType);
    this.form = this._fb.group({
      loanAmount: [this.loanDetails.loanAmount ? this.loanDetails.loanAmount : this._utility.currencyFormatter(this.range.min), [Validators.required, Validators.minLength(6), Validators.maxLength(10), this._validators.numberRange(this.range.min, this.range.max)]],
      purpose: [this.loanDetails.purpose ? this.loanDetails.purpose : ''],
      tenure: [this.loanDetails.tenure ? this.loanDetails.tenure : 1, [Validators.required, this._validators.numberRange(this.minTenure, this.maxTenure)]],
      loanType: [lType, [Validators.required]],
    });
    this.tenureDenominatorSubject.next(this._loanService.getDenominator(this.tenure.value, this.loanType.value));
    this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(this.loanAmount.value), this.tenure.value, this.loanType.value));
    this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value, this.tenure.value));

    this.loanAmount.valueChanges.subscribe(v => {

      this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(v), this.tenure.value, this.loanType.value));
      this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value, this.tenure.value));
      this.rate = this._loanService.getRate(lType, this._utility.convertToPlainNumber(this.loanAmount.value), this.range.min, this.range.max);
    })

    this.tenure.valueChanges.subscribe(v => {

      this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(this.loanAmount.value), v, this.loanType.value));
      this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value, v));
      this.tenureDenominatorSubject.next(this._loanService.getDenominator(v, this.loanType.value));
      this.rate = this._loanService.getRate(lType, this._utility.convertToPlainNumber(this.loanAmount.value), this.range.min, this.range.max);
    })

    this.pagingSubject = this._loanService.pagingSubject;
  }
  moveToApply(): void {
    this.applyNow.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }
  selectLoan(id: number) {
    this._requestService.selectLoanLog(id);
    this.showSubject.next(true);
  }

  activate(value: string) {
    this.activeFilterSubject.next(value);
  }

  onSubmit(form: FormGroup) {

    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    if (!this._loanService.runningLoanSubject.value) {
      this.loadingSubject.next(true);

      this._store.setLoanType(this.loanType.value);
      const loanDetails: LoanDetails = {
        rate: this.rate, monthlyRepayment: this.monthlyRepaymentSubject.value.toLocaleString('en-NG', {
          style: 'currency',
          currency: 'NGN'
        }), loanAmount: this.loanAmount.value, tenure: this.tenure.value, denominator: this.tenureDenominatorSubject.value, purpose: this.purpose.value, totalRepayment: this.totalRepaymentSubject.value.toLocaleString('en-NG', {
          style: 'currency',
          currency: 'NGN'
        })
      };
      this._store.setLoanCalculator(loanDetails);
      this.onNavigate('apply/applying-as');
    } else {
      this._utility.toggleLoanInvalid();
    }
  }
  onNavigate(route: string, params: any = {}): void {
    let r = this.base + route;
    this._router.navigate([r], { queryParams: params })
  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }
  changeFilter(value: any) {
    this.activate(value);
    this._loanService.filterSubject.next(value);
  }

  trackByFn(index: any, item: any) {
    return index;
  }
  close() {
    this.showSubject.next(false);
  }

  getDaysLeft(date: any) {
    let d = moment(date);
    let now = moment();
    return d.diff(now, "days");
  }

  getNextDueDateFormatted(dateFunded: any, tenure: number, denominator: string) {
    return this._loanService.getNextDueDateFormatted(dateFunded, tenure, denominator);
  }

  showRepayment(id: number) {
    this.showRepaymentSubject.next(true);
    this._repaymentService.selectLoan(id);
  }
  closeRepayment() {
    this.showRepaymentSubject.next(false);
  }
  getStatusColor(status: string) {
    if (status == "Paid In Full" || status == "FullPayment") return 'success';
    return status == "Defaulted" ? 'danger' : status == 'Partial' ? 'info' : '';
  }

  getLoanStatusColor(status: string) {
    if (status == "Approved" || status == "Funded" || status == "Completed") return 'success';
    if (status == "NotQualified" || status == "Declined" || status == "Defaulting") return 'danger';
    return status == "Processing" ? '' : 'info';
  }
  download(url: string, filename: string) {
    this._documentService.download(url, filename)
  }

  documentUpload(loanType: string, applyingAs: string, loanRequestID: number) {
    this.showUploadSubject.next(true)
    this.getRequirements(loanType, applyingAs)
    this.loanRequestID = loanRequestID
  }
  closeUpload() {
    this.showUploadSubject.next(false)
  }

  getRequirements(loanType: string, applyingAs: string) {
    let loanTypes: any = this._store.loanTypes.find(type => type.title == loanType);
    this.requirements = loanTypes?.applyingAs?.find((type: any) => type.title == applyingAs)?.requirements || [];
    console.log(this.requirements)
  }

  onChange(result: any) {
    this._documentService.attachDocument(result.id, this.loanRequestID).subscribe(c => {
      this._utility.setSuccess("Document Uploaded successfully")
      this.showUploadSubject.next(false);
      this.showSubject.next(false);
    }, error => {
      this._utility.setError("Error:"+error)
    })
  }


}
