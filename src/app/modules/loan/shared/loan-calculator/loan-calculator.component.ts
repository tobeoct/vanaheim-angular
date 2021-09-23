import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VCValidators } from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { LoanService } from 'src/app/shared/services/loan/loan.service';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { LoanDetails } from './loan-details';
import { NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
const data: any[] = [
  { title: "PayDay Loans", allowedApplicant: ["Salary Earner", "Business Owner"], allowedTypes: ["Personal Loans", "Float Me - Personal"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Personal Line Of Credit", allowedApplicant: ["Salary Earner", "Business Owner"], allowedTypes: ["Personal Loans", "Float Me - Personal"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "LPO Financing", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business", "LPO Financing"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Business Loans", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Business Line Of Credit", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business"], description: "Spread your loan payment, repay when you get your salary" },
]

@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanCalculatorComponent implements OnInit {
  lType: string;
  applyingAs: string;
  loanProduct: string;
  form: FormGroup;
  repaymentForm: FormGroup;
  minTenure: number = 1;
  maxTenure: number = 12;
  range: any;
  tenureDenominator: string = "Mos";
  loanDetails: LoanDetails;
  monthlyRepaymentSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  monthlyRepayment$: Observable<number> = this.monthlyRepaymentSubject.asObservable();

  isLoggedIn: boolean;

  totalRepaymentSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalRepayment$: Observable<number> = this.totalRepaymentSubject.asObservable();


  tenureDenominatorSubject: BehaviorSubject<string> = new BehaviorSubject<string>("Mos");
  tenureDenominator$: Observable<string> = this.tenureDenominatorSubject.asObservable();

  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  planLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  planLoading$: Observable<boolean> = this.planLoadingSubject.asObservable();
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();
  errorMessage2Subject: Subject<any> = new Subject<any>();
  errorMessage2$: Observable<any> = this.errorMessage2Subject.asObservable();
  loanPurposes: string[] = [];
  activeTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$: Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();


  rate: number;
  get loanType() {
    return this.form.get("loanType") as FormControl || new FormControl();
  }

  get tenure() {
    return this.form.get("tenure") as FormControl || new FormControl();
  }
  get loanAmount() {
    return this.form.get("loanAmount") as FormControl || new FormControl();
  }

  get purpose() {
    return this.form.get("purpose") as FormControl || new FormControl();
  }

  get email() {
    return this.repaymentForm.get("email") as FormControl || new FormControl();
  }
  base: string;
  constructor(private _router: Router, private _fb: FormBuilder, private _store: Store, private _zone: NgZone,
    private _validators: VCValidators, private _route: ActivatedRoute, private _loanService: LoanService, private _utility: Utility, private _authService: AuthService) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
    this.loanDetails = this._store.loanCalculator as LoanDetails;
    this.lType = this._store.loanType;
    this.applyingAs = this._store.applyingAs;
    this.loanProduct = this._store.loanProduct;
    this._store.titleSubject.next("Loan Calculator");
    this.range = this._loanService.getMinMax(this.lType);
    this.loanPurposes = this._loanService.getLoanPurposes(this.lType);
    let tenureRange = this._loanService.getTenureRange(this.lType);
    this.minTenure = tenureRange["min"];
    this.maxTenure = tenureRange["max"];
    this.form = this._fb.group({
      loanAmount: [this.loanDetails.loanAmount ? this.loanDetails.loanAmount : this._utility.currencyFormatter(this.range.min), [Validators.required, Validators.minLength(6), Validators.maxLength(10), this._validators.numberRange(this.range.min, this.range.max)]],
      purpose: [this.loanDetails.purpose ? this.loanDetails.purpose : '', [Validators.required]],
      tenure: [this.loanDetails.tenure ? this.loanDetails.tenure : 1, [Validators.required, this._validators.numberRange(this.minTenure, this.maxTenure)]],
    });
    this.repaymentForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.rate = this._loanService.getRate(this.lType, this._utility.convertToPlainNumber(this.loanAmount.value), this.range.min, this.range.max);
    this.tenureDenominatorSubject.next(this._loanService.getDenominator(this.tenure.value, this.lType));
    let d = data.filter(d => d.allowedTypes.includes(this.loanType) && d.allowedApplicant.includes(this.applyingAs));
    this.dataSelectionSubject.next(d);
    this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(this.loanAmount.value), this.tenure.value, this.lType));
    this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value, this.tenure.value));

    this.loanAmount.valueChanges.subscribe(v => {

      this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(v), this.tenure.value, this.lType));
      this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value, this.tenure.value));
      this.rate = this._loanService.getRate(this.lType, this._utility.convertToPlainNumber(this.loanAmount.value), this.range.min, this.range.max);
    })

    this.tenure.valueChanges.subscribe(v => {

      this.monthlyRepaymentSubject.next(this._loanService.calculateMonthlyRepayment(this._utility.convertToPlainNumber(this.loanAmount.value), v, this.lType));
      this.totalRepaymentSubject.next(this._loanService.getTotalRepayment(this.monthlyRepaymentSubject.value, v));
      this.tenureDenominatorSubject.next(this._loanService.getDenominator(v, this.lType));
      this.rate = this._loanService.getRate(this.lType, this._utility.convertToPlainNumber(this.loanAmount.value), this.range.min, this.range.max);
    })
  }

  allSubscriptions: Subscription[] = [];
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

  onSubmit = (form: any) => {
    const loanDetails: LoanDetails = {
      rate: this.rate * 100, monthlyRepayment: this.monthlyRepaymentSubject.value.toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN',
      }), loanAmount: this.loanAmount.value, tenure: this.tenure.value, denominator: this.tenureDenominatorSubject.value.replace("Mo", "Month"), purpose: this.purpose.value, totalRepayment: this.totalRepaymentSubject.value.toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN',
      })
    };
    this._store.setLoanCalculator(loanDetails);
    this.onNavigate(this._store.loanCategory == "personal" ? "bvn-info" : this.isLoggedIn ? "company-info" : "contact-info");
  }
  onSubmit2 = (event: any) => {
    this.planLoadingSubject.next(true);
    this._loanService.repaymentPlan({ email: this.email.value, purpose: this.purpose.value, rate: this.rate, monthlyRepayment: this.monthlyRepaymentSubject.value, tenure: this.tenure.value, denominator: this.tenureDenominatorSubject.value?.replace("Mo", "Month"), loanAmount: this.loanAmount.value, loanType: this.lType })
      .subscribe(data => {
        //  console.log("Res",data)
        this._zone.run(() => {
          this.planLoadingSubject.next(false);
          this._utility.setSuccess("Repayment Plan has been sent to your email");

        });
      },
        (error: string) => {
          console.log("Error", error)
          this._zone.run(() => {
            this.planLoadingSubject.next(false);
            this._utility.setError("Repayment Plan failed to send");
          });
        })
  }
  onNavigate(route: string, params: any = {}): void {

    let r = this.base + route;
    this._router.navigate([r], { queryParams: params })
  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }

  onError2(value: any): void {
    this.errorMessage2Subject.next(value);
  }
}
