import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VCValidators } from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, filter, first, take } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { PersonalInfo } from './personal-info';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import moment = require('moment');
import { Utility } from 'src/app/shared/helpers/utility.service';
import { SideNavigationList } from 'src/app/shared/constants/enum';
const data: any[] = [
  { title: "PayDay Loans", allowedApplicant: ["Salary Earner", "Business Owner"], allowedTypes: ["Personal Loans", "Float Me - Personal"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Personal Line Of Credit", allowedApplicant: ["Salary Earner", "Business Owner"], allowedTypes: ["Personal Loans", "Float Me - Personal"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "LPO Financing", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business", "LPO Financing"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Business Loans", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Business Line Of Credit", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business"], description: "Spread your loan payment, repay when you get your salary" },
]
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalInfoComponent implements OnInit {
  form: FormGroup;
  titles: string[];
  months: string[];
  states: string[];
  maritalStatuses: string[];
  genders: string[];
  @Input()
  side: boolean = false;
  activeTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$: Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();

  customerFromDb: any;

  get surname() {
    return this.form.get("surname") as FormControl || new FormControl();
  }
  get gender() {
    return this.form.get("gender") as FormControl || new FormControl();
  }
  get maritalStatus() {
    return this.form.get("maritalStatus") as FormControl || new FormControl();
  }
  get firstName() {
    return this.form.get("firstName") as FormControl || new FormControl();
  }
  get otherNames() {
    return this.form.get("otherNames") as FormControl || new FormControl();
  }
  get title() {
    return this.form.get("title") as FormControl || new FormControl();
  }

  get dobGroup() {
    return this.form.get("dobGroup") as FormGroup || new FormControl();
  }
  get day() {
    return this.form.get("dobGroup.day") as FormControl || new FormControl();
  }
  get month() {
    return this.form.get("dobGroup.month") as FormControl || new FormControl();
  }
  get year() {
    return this.form.get("dobGroup.year") as FormControl || new FormControl();
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

  constructor(private _router: Router, private _utility: Utility, private _fb: FormBuilder, private _store: Store, private _customerService: CustomerService,
    private _validators: VCValidators, private _route: ActivatedRoute, private _authService: AuthService) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
    });
  }

  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  
  apiSuccessSubject:Subject<string> = new Subject<string>(); 
  apiSuccess$:Observable<string> = this.apiSuccessSubject.asObservable();
  
  apiErrorSubject:Subject<string> = new Subject<string>(); 
  apiError$:Observable<string> = this.apiErrorSubject.asObservable();
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();
  ngOnInit(): void {

    let year = new Date().getFullYear();
    let max = year - 18;
    const personalInfo = this._store.personalInfo as PersonalInfo;
    this.form = this._fb.group({
      surname: [personalInfo.surname ? personalInfo.surname : "", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      firstName: [personalInfo.firstName ? personalInfo.firstName : "", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      otherNames: [personalInfo.otherNames ? personalInfo.otherNames : ""],
      title: [personalInfo.title ? personalInfo.title : "", [Validators.required]],
      gender: [personalInfo.gender ? personalInfo.gender : "", [Validators.required]],
      maritalStatus: [personalInfo.maritalStatus ? personalInfo.maritalStatus : "", [Validators.required]],
      dobGroup: this._fb.group({
        day: [personalInfo.dob?.day ? personalInfo.dob.day : 1, [Validators.required, Validators.min(1), Validators.max(31)]],
        month: [personalInfo.dob?.month ? personalInfo.dob.month : 'January', [Validators.required]],
        year: [personalInfo.dob?.year ? personalInfo.dob.year : max, [Validators.required, Validators.min(1900), Validators.max(2002)]]
      },
        {}),
      contactGroup: this._fb.group({
        email: [personalInfo.email ? personalInfo.email : "", [Validators.required, Validators.email]],
        phone: [personalInfo.phoneNumber ? personalInfo.phoneNumber : "", [Validators.required, this._validators.phone]],
        addressGroup: this._fb.group({
          street: [personalInfo.address?.street ? personalInfo.address.street : "", [Validators.required]],
          city: [personalInfo.address?.city ? personalInfo.address.city : "", [Validators.required]],
          state: [personalInfo.address?.state ? personalInfo.address.state : "", [Validators.required]]
        },
          {})
      },
        {}),

    });

    if (this._authService.isLoggedIn()) {
      this._customerService.customer().pipe(take(1)).subscribe(c => {
        // console.log(c);
        this.patchValue(c)
      });
    }
    this._store.titleSubject.next("Personal Information");
    this.titles = this._store.titles;
    this.states = this._store.states;
    this.months = this._store.months;
    this.genders = this._store.genders;
    this.maritalStatuses = this._store.maritalStatuses;
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

  toggleSideNav = (type: any) => {
    type = type as SideNavigationList;
    this._utility.toggleSideNav(type);
  }
  patchValue(customer: any) {
    // BVN: "22326677629"
    if (customer) {
      if (!this.email.value && customer.email) {
        this.email.patchValue(customer.email);
      }
      if (!this.title.value && customer.title) {
        this.title.patchValue(customer.title);
      }
      if (!this.phone.value && customer.phoneNumber) {
        this.phone.patchValue(customer.phoneNumber);
      }
      if (!this.firstName.value && customer.firstName) {
        this.firstName.patchValue(customer.firstName);
      }
      if (!this.surname.value && customer.lastName) {
        this.surname.patchValue(customer.lastName);
      }
      if (!this.otherNames.value && customer.otherNames) {
        this.otherNames.patchValue(customer.otherNames);
      }
      if (!this.gender.value && customer.gender) {
        this.gender.patchValue(customer.gender);
      }
      if (!this.maritalStatus.value && customer.maritalStatus) {
        this.maritalStatus.patchValue(customer.maritalStatus);
      }
      if (customer.address) {
        let a = customer.address.split(",");
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

      if (customer.dateOfBirth) {
        let d = moment(customer.dateOfBirth);
        let day = d.get("day");
        let month = d.get("month");
        let year = d.get("year");
        if (!this.day.value) {
          this.day.patchValue(day);
        }
        if (!this.month.value) {
          this.month.patchValue(month);
        }
        if (!this.year.value) {
          this.year.patchValue(year);
        }
      }
    }
  }
  onSubmit = (form: FormGroup) => {
    if (!form.valid) return;
    const personalInfo: PersonalInfo = { title: this.title.value, surname: this.surname.value, gender: this.gender.value, maritalStatus: this.maritalStatus.value, firstName: this.firstName.value, otherNames: this.otherNames.value, email: this.email.value, phoneNumber: this.phone.value, dob: { day: this.day.value, month: this.month.value, year: this.year.value }, address: { street: this.street.value, city: this.city.value, state: this.state.value } };
    this._store.setPersonalInfo(personalInfo);
    if (!this.side) {
      this.onNavigate("account-info");
    }else{
      this.loadingSubject.next(true);
      this._customerService.updateCustomer(personalInfo).pipe(first())
      .subscribe(
          (data:any) => {
            this.loadingSubject.next(false);
            this.apiSuccessSubject.next(data);
            setTimeout(()=>{this.apiSuccessSubject.next();},5000)
          },
          (error:any) => {
              setTimeout(()=>{this.apiErrorSubject.next("Error: "+error);this.loadingSubject.next(false);},1000)
              setTimeout(()=>{this.apiErrorSubject.next();},5000)
              
          });
    }
  }
  nok() {
    this._utility.toggleSideNav(SideNavigationList.nok);
  }
  onNavigate(route: string, params: any = {}): void {
    const r = this.base + route;
    this._router.navigate([r], { queryParams: params })
  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }
}
