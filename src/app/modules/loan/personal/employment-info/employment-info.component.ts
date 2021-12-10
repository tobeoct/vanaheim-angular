import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VCValidators } from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, EMPTY, from, Observable, Subject, Subscription } from 'rxjs';
import { catchError, delay, filter, map, take, tap } from 'rxjs/operators';
import { LoanStore, Store } from 'src/app/shared/helpers/store';
import { EmploymentInfo } from './employment-info';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
const data: any[] = [
  { title: "PayDay Loans", allowedApplicant: ["Salary Earner", "Business Owner"], allowedTypes: ["Personal Loans", "Float Me - Personal"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Personal Line Of Credit", allowedApplicant: ["Salary Earner", "Business Owner"], allowedTypes: ["Personal Loans", "Float Me - Personal"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "LPO Financing", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business", "LPO Financing"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Business Loans", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Business Line Of Credit", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business"], description: "Spread your loan payment, repay when you get your salary" },
]
@Component({
  selector: 'app-employment-info',
  templateUrl: './employment-info.component.html',
  styleUrls: ['./employment-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmploymentInfoComponent implements OnInit {
  form: FormGroup;
  businessSectors: string[];
  states: string[];
  activeTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._loanStore.loanProduct);
  activeTab$: Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();


  get payDay() {
    return this.form.get("payDay") as FormControl || new FormControl();
  }
  get netMonthlySalary() {
    return this.form.get("netMonthlyAmount") as FormControl || new FormControl();
  }
  get businessSector() {
    return this.form.get("businessSector") as FormControl || new FormControl();
  }
  get employer() {
    return this.form.get("employer") as FormControl || new FormControl();
  }
  get employerId() {
    return this.form.get("id") as FormControl || new FormControl();
  }
  get contactGroup() {
    return this.form.get("contactGroup") as FormGroup || new FormControl();
  }
  get email() {
    return this.form.get("contactGroup.email") as FormControl || new FormControl();
  }
  get phone() {
    return this.form.get("contactGroup.phone") as FormControl || new FormControl();
  }
  get addressGroup() {
    return this.form.get("contactGroup.addressGroup") as FormGroup || new FormControl();
  }
  get street() {
    return this.form.get("contactGroup.addressGroup.street") as FormControl || new FormControl();
  }
  get city() {
    return this.form.get("contactGroup.addressGroup.city") as FormControl || new FormControl();
  }
  get state() {
    return this.form.get("contactGroup.addressGroup.state") as FormControl || new FormControl();
  }
  base: string;
  constructor(private _router: Router, private _fb: FormBuilder, private _store: Store,private _loanStore:LoanStore, private _authService: AuthService, private _customerService: CustomerService,
    private _validators: VCValidators, private _route: ActivatedRoute) {
      this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
        this.base = x.url.replace(/\/[^\/]*$/, '/');
      });
  }

  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();


  employers: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  employersFromDb$: Observable<any[]> = this.employers.asObservable();

  dataLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  dataLoading$: Observable<boolean> = this.dataLoadingSubject.asObservable();
  isLoggedIn: boolean;
  showFormSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showForm$: Observable<boolean> = this.showFormSubject.asObservable();
  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.dataLoadingSubject.next(true);
      this.employersFromDb$ = this._customerService.employers().pipe(map((c: any[]) => {
        this.employers.next(c);
        this.patchValue(c)
        return c;
      }), take(1), tap(c => this.dataLoadingSubject.next(false)), catchError(c => { console.log(c); this.dataLoadingSubject.next(false); return EMPTY }));
    } else {
      this.showForm();
    }

    const employmentInfo = this._loanStore.employmentInfo as EmploymentInfo;
    this.form = this._fb.group({
      id: [0],
      netMonthlyAmount: [employmentInfo.netMonthlySalary ? employmentInfo.netMonthlySalary : "", [Validators.required]],
      employer: [employmentInfo.employer ? employmentInfo.employer : "", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      businessSector: [employmentInfo.businessSector ? employmentInfo.businessSector : "", [Validators.required]],
      payDay: [employmentInfo.payDay ? employmentInfo.payDay : 1, [Validators.required]],

      contactGroup: this._fb.group({
        email: [employmentInfo.email ? employmentInfo.email : "", [Validators.required, Validators.email]],
        phone: [employmentInfo.phoneNumber ? employmentInfo.phoneNumber : "", [Validators.required, this._validators.phone]],
        addressGroup: this._fb.group({
          street: [employmentInfo.address?.street ? employmentInfo.address.street : "", [Validators.required]],
          city: [employmentInfo.address?.city ? employmentInfo.address.city : "", [Validators.required]],
          state: [employmentInfo.address?.state ? employmentInfo.address.state : "", [Validators.required]]
        },
          { validator: Validators.required })
      },
        { validator: Validators.required }),

    });

    this._loanStore.titleSubject.next("Employment Information");
    this.businessSectors = this._store.businessSectors;
    this.states = this._store.states;
    this.employerId.valueChanges.subscribe(c => {
      if (c > 0) {

        this.setValue(this.employers.value.find(e => e.id == c));
      }
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

  patchValue(employer: any) {
    if (employer) {
      if (!this.email.value && employer.email) {
        this.email.patchValue(employer.email);
      }
      if (!this.netMonthlySalary.value && employer.netMonthlySalary) {
        this.netMonthlySalary.patchValue(employer.netMonthlySalary);
      }
      if (!this.phone.value && employer.phoneNumber) {
        this.phone.patchValue(employer.phoneNumber);
      }
      if (!this.employer.value && employer.employer) {
        this.employer.patchValue(employer.employer);
      }
      if (!this.businessSector.value && employer.businessSector) {
        this.businessSector.patchValue(employer.businessSector);
      }
      if (!this.payDay.value && employer.payDay) {
        this.payDay.patchValue(employer.payDay);
      }
      if (employer.address) {
        let a = employer.address.split(",");
        let street = a[0];
        let city = a[1];
        let state = a[2];
        if (!this.street.value) {
          this.street.patchValue(street);
        }
        if (!this.city.value) {
          this.city.patchValue(city);
        }
        if (!this.state.value) {
          this.state.patchValue(state);
        }
      }

    }
  }
  setValue(employer: any) {
    if (employer) {
      if (employer.email) {
        this.email.patchValue(employer.email);
      }
      if (employer.netMonthlySalary) {
        this.netMonthlySalary.patchValue(employer.netMonthlySalary);
      }
      if (employer.phoneNumber) {
        this.phone.patchValue(employer.phoneNumber);
      }
      if (employer.employer) {
        this.employer.patchValue(employer.employer);
      }
      if (employer.businessSector) {
        this.businessSector.patchValue(employer.businessSector);
      }
      if (employer.payDay) {
        this.payDay.patchValue(employer.payDay);
      }
      if (employer.address) {
        let a = employer.address.split(",");
        let street = a[0];
        let city = a[1];
        let state = a[2];
        this.street.patchValue(street);
        this.city.patchValue(city);
        this.state.patchValue(state);

      }

    }
  }
  showForm() {
    this.showFormSubject.next(true);
  }

  onSubmit = (form: FormGroup) => {
    if (!form.valid) return;
    const employmentInfo: EmploymentInfo = { id: this.employerId.value, payDay: this.payDay.value, businessSector: this.businessSector.value, netMonthlySalary: this.netMonthlySalary.value, employer: this.employer.value, email: this.email.value, phoneNumber: this.phone.value, address: { street: this.street.value, city: this.city.value, state: this.state.value } };
    this._loanStore.setEmploymentInfo(employmentInfo);
    this.onNavigate("nok-info");
  }
  onNavigate(route: string, params: any = {}): void {
    const r = this.base + route;
    this._router.navigate([r], { queryParams: params })
  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }
}
