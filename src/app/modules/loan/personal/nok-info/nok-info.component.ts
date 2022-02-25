import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VCValidators } from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, filter, first, take } from 'rxjs/operators';
import { LoanStore, Store } from 'src/app/shared/helpers/store';
import { NOKInfo } from './nok-info';
import { DateRange } from 'src/app/shared/components/date/date';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import moment = require('moment');
import { Utility } from 'src/app/shared/helpers/utility.service';
import { SideNavigationList } from 'src/app/shared/constants/enum';

@Component({
  selector: 'app-nok-info',
  templateUrl: './nok-info.component.html',
  styleUrls: ['./nok-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NOKInfoComponent implements OnInit {
  form: FormGroup;
  titles: string[];
  months: string[];
  states: string[];
  @Input()
  side: boolean = false;
  range: DateRange = DateRange.all;
  activeTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._loanStore.loanProduct);
  activeTab$: Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();


  get surname() {
    return this.form.get("surname") as FormControl || new FormControl();
  }
  get otherNames() {
    return this.form.get("otherNames") as FormControl || new FormControl();
  }
  get title() {
    return this.form.get("title") as FormControl || new FormControl();
  }

  get relationship() {
    return this.form.get("relationship") as FormControl || new FormControl();
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

  get id() {
    return this.form.get("id") as FormControl || new FormControl();
  }

  base: string;
  nokFromDb$: Observable<any>;
  constructor(private _router: Router, private _utility: Utility, private _fb: FormBuilder, private _store: Store,private _loanStore:LoanStore,
    private _validators: VCValidators, private _route: ActivatedRoute, private _authService: AuthService, private _customerService: CustomerService) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
    });
  }
  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  apiSuccessSubject: Subject<string> = new Subject<string>();
  apiSuccess$: Observable<string> = this.apiSuccessSubject.asObservable();

  apiErrorSubject: Subject<string> = new Subject<string>();
  apiError$: Observable<string> = this.apiErrorSubject.asObservable();
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();
  ngOnInit(): void {
    if (this._authService.isLoggedIn()) {
      this.nokFromDb$ = this._customerService.nok().pipe(take(1));
    }
    let max = new Date().getFullYear();
    const nokInfo = this._loanStore.nokInfo as NOKInfo;
    this.form = this._fb.group({
      id: [0],
      surname: [nokInfo.surname ? nokInfo.surname : "", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      otherNames: [nokInfo.otherNames ? nokInfo.otherNames : ""],
      title: [nokInfo.title ? nokInfo.title : "", [Validators.required]],
      relationship: [nokInfo.relationship ? nokInfo.relationship : "", [Validators.required]],
      dobGroup: this._fb.group({
        day: [nokInfo.dob?.day ? nokInfo.dob.day : 1, [Validators.required, Validators.min(1), Validators.max(31)]],
        month: [nokInfo.dob?.month ? nokInfo.dob.month : 'January', [Validators.required]],
        year: [nokInfo.dob?.year ? nokInfo.dob.year : max, [Validators.required, Validators.min(1900), Validators.max(2002)]]
      },
        {}),
      contactGroup: this._fb.group({
        email: [nokInfo.email ? nokInfo.email : "", [Validators.required, Validators.email]],
        phone: [nokInfo.phoneNumber ? nokInfo.phoneNumber : "", [Validators.required, this._validators.phone]]
      },

        {}),

    });
    if (this._authService.isLoggedIn()) {
      this._customerService.nok().pipe(take(1)).subscribe(c => {
        // console.log(c);
        this.patchValue(c)
      });
    }
    this._loanStore.titleSubject.next("Next Of Kin Information");
    this.titles = this._store.titles;
    this.states = this._store.states;
    this.months = this._store.months;
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

  onSubmit = (form: FormGroup) => {
    if (!form.valid) return;
    const nokInfo: NOKInfo = { id: 0, title: this.title.value, relationship: this.relationship.value, surname: this.surname.value, otherNames: this.otherNames.value, email: this.email.value, phoneNumber: this.phone.value, dob: { day: this.day.value, month: this.month.value, year: this.year.value } };
    this._loanStore.setNOKInfo(nokInfo);
    if (!this.side) {
      this.onNavigate("upload");
    } else {
      this.loadingSubject.next(true);
      this._customerService.updateNOK(nokInfo).pipe(first())
        .subscribe(
          (data: any) => {
            this.loadingSubject.next(false);
            this._utility.toggleSideNav(SideNavigationList.personal);
            this.apiSuccessSubject.next(data);
            setTimeout(() => { this.apiSuccessSubject.next(); }, 5000)
          },
          (error: any) => {
            setTimeout(() => { this.apiErrorSubject.next("Error: " + error); this.loadingSubject.next(false); }, 1000)
            setTimeout(() => { this.apiErrorSubject.next(); }, 5000)

          });

    }
  }

  patchValue(nok: any) {
    // BVN: "22326677629"
    if (nok) {
      if (!this.email.value && nok.email) {
        this.email.patchValue(nok.email);
      }
      if (!this.title.value && nok.title) {
        this.title.patchValue(nok.title);
      }
      if (!this.phone.value && nok.phoneNumber) {
        this.phone.patchValue(nok.phoneNumber);
      }
      if (!this.surname.value && nok.lastName) {
        this.surname.patchValue(nok.lastName);
      }
      if (!this.otherNames.value && nok.otherNames) {
        this.otherNames.patchValue(nok.otherNames);
      }
      if (!this.relationship.value && nok.relationship) {
        this.relationship.patchValue(nok.relationship);
      }
      if (nok.dateOfBirth) {
        let d = moment(nok.dateOfBirth);
        let day = d.get("day");
        let month =d.format('MMMM')// d.get("month");
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
  onNavigate(route: string, params: any = {}): void {
    const r = this.base + route;
    this._router.navigate([r], { queryParams: params })
  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }
}
