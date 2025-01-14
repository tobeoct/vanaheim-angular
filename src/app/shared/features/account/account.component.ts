import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VCValidators } from '@validators/default.validators';
import { BehaviorSubject, Observable, from, Subject, EMPTY, Subscription } from 'rxjs';
import { filter, delay, map, take, tap, catchError, first } from 'rxjs/operators';
import { AccountInfo } from 'src/app/modules/loan/shared/account-info/account-info';
import { Store } from '../../helpers/store';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth/auth.service';
import { CommonService } from '../../services/common/common.service';
import { CustomerService } from '../../services/customer/customer.service';
@Component({
  selector: 'app-side-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class SideAccountComponent implements OnInit {

  form: FormGroup;
  titles: string[];
  banks: any[];
  @Input()
  side: boolean = false;
  loanCategorySubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  loanCategory$: Observable<string> = this.loanCategorySubject.asObservable();
  loanCategory: string//= localStorage.getItem("category")||'';
  activeTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$: Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();

  base: string;
  get accountArrayGroups() {
    return this.accountArray.controls as FormGroup[] || new FormControl();
  }
  get accountArray() {
    return this.form.get("accountArray") as FormArray || new FormControl();
  }
  get bank() {
    return this.form.get("accountGroup.bank") as FormControl || new FormControl();
  }
  get accountNumber() {
    return this.form.get("accountGroup.accountNumber") as FormControl || new FormControl();
  }
  get accountName() {
    return this.form.get("accountGroup.accountName") as FormControl || new FormControl();
  }

  get pay() {
    return this.form.get("pay") as FormControl || new FormControl();
  }

  get valid() {
    return this.form.get("valid") as FormControl || new FormControl();
  }

  // get salaryId(){
  //   return this.form.get("salaryId") as FormControl|| new FormControl();
  // }
  // get loanAccountId(){
  //   return this.form.get("loanAccountId") as FormControl|| new FormControl();
  // }
  constructor(private _router: Router, private _fb: FormBuilder, private _store: Store,
    private _validators: VCValidators, private _customerService: CustomerService, private _authService: AuthService, private _route: ActivatedRoute, private _commonService: CommonService) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
    });
  }

  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  disableInputSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  disableInput$: Observable<boolean> = this.disableInputSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();

  apiErrorSubject: Subject<any> = new Subject<any>();
  apiError$: Observable<any> = this.apiErrorSubject.asObservable();
  apiSuccessSubject: Subject<any> = new Subject<any>();
  apiSuccess$: Observable<any> = this.apiSuccessSubject.asObservable();
  allSubscriptions: Subscription[] = [];

  isLoggedIn: boolean;
  accounts: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  accountsFromDb$: Observable<any[]> = this.accounts.asObservable();

  dataLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  dataLoading$: Observable<boolean> = this.dataLoadingSubject.asObservable();

  showFormSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showForm$: Observable<boolean> = this.showFormSubject.asObservable();
  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.dataLoadingSubject.next(true);
      this.accountsFromDb$ = this._commonService.accounts().pipe(map((c: any[]) => {
        // this.accounts.next(c);
        let groups = this.buildAccountGroups(c);
        groups.forEach(g => {
          this.accountArray.push(g);
        })
        return c;
      }), take(1), tap(c => this.dataLoadingSubject.next(false)), catchError(c => { console.log(c); this.dataLoadingSubject.next(false); return EMPTY }));
    } else {
      this.showForm();
    }
    let accountInfo = this._store.accountInfo as AccountInfo[];
    if (accountInfo.length == 0) accountInfo = [new AccountInfo()];
    let account2: AccountInfo = new AccountInfo();
    this.form = this._fb.group({
      accountArray: this._fb.array([]),
      valid: [],
    });

    if (accountInfo.length > 1) {
      account2 = accountInfo[1];
    }
    this.titles = this._store.titles;
    this.banks = this._store.banks;


  }

  focus() {
    this.focusSubject.next(true)
  }

  showForm() {
    this.showFormSubject.next(true);
  }

  ngAfterViewInit(): void {
    const sub = this.delay$.subscribe(c => {
      this.focus();
    })
    this.allSubscriptions.push(sub);
    this.loanCategory$ = this.loanCategory$;
    // console.log(this._store.loanCategory);
    // this.loanCategory = this._store.loanCategory;
    this.loanCategorySubject.next(this._store.loanCategory)
  }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(sub => sub.unsubscribe());
  }


  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  buildAccountGroup = (accountInfo: any) => {
    if (accountInfo) this.accounts.next([accountInfo]);
    let group = new FormGroup({
      id: new FormControl(accountInfo.id ? accountInfo.id : 0),
      bank: new FormControl(accountInfo.bank ? accountInfo.bank : '', [Validators.required]),
      accountNumber: new FormControl(accountInfo.number ? accountInfo.number : '', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      accountName: new FormControl(accountInfo.name ? accountInfo.name : '', [Validators.required])
    }, { validators: [Validators.required] })
    let nameCtrl = group.get("accountName") as FormControl;
    group.get("bank")?.valueChanges.subscribe(v => {

      if (group.get("accountNumber")?.valid && group.get("bank")?.valid) {
        if (!group.get("id")?.value) {
          this.onValidate(group.get("accountNumber")?.value, v, nameCtrl);
        }
      }
    })
    group.get("accountNumber")?.valueChanges.subscribe(v => {
      if (group.get("bank")?.valid && group.get("accountNumber")?.valid) {
        // console.log(v)
        if (!group.get("id")?.value) {
          this.onValidate(v, group.get("bank")?.value, nameCtrl);
        }
      }
    })

    group.get("id")?.valueChanges.subscribe(v => {
      let id = group.get("id")?.value;
      if (id && id > 0) {
        let a = this.accounts.value.find(c => c.id == id);
        if (a) {
          group.get("bank")?.patchValue(a.bank);
          group.get("bank")?.updateValueAndValidity();
          group.get("accountNumber")?.patchValue(a.number);
          group.get("accountNumber")?.updateValueAndValidity();
          group.get("accountName")?.patchValue(a.name);
          group.get("accountName")?.updateValueAndValidity();
        }
      }
    })
    return group;
  }

  buildAccountGroups = (accountInfos: AccountInfo[]): FormGroup[] => {
    let groups: FormGroup[] = [];
    for (let i = 0; i < accountInfos.length; i++) {
      let group = this.buildAccountGroup(accountInfos[i]);
      groups.push(group);

    }
    return groups
  }
  onSubmit = (form: FormGroup) => {
    this.disableInputSubject.next(false);
    if (!form.valid) return;

    const accounts: any[] = form.value["accountArray"];

    let accountInfo: AccountInfo[] = []
    accounts.forEach((group: any, i) => {
      let info = new AccountInfo();
      info.id = group["id"];
      info.bank = group["bank"];
      info.accountName = group["accountName"];
      info.accountNumber = group["accountNumber"];
      accountInfo.push(info);
    })

    this.update(accountInfo);


  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }
  displayMessage(success: boolean) {
    this.loadingSubject.next(false);
    if (success) {
      this.valid.setErrors(null);
      this.apiErrorSubject.next(); this.apiSuccessSubject.next("Account Verification Successful");
      setTimeout(() => this.apiSuccessSubject.next(), 2000);
    } else {
      this.apiErrorSubject.next("Account Verification Failed"); this.apiSuccessSubject.next();
      setTimeout(() => this.apiErrorSubject.next(), 2000);
    }
  }

  update(accountInfos: AccountInfo[]) {
    this._customerService.updateAccounts(accountInfos)
      .pipe(first())
      .subscribe(
        data => {
          this.apiSuccessSubject.next("Update was successful");
          setTimeout(() => { this.apiSuccessSubject.next(); }, 5000)
        },
        error => {
          setTimeout(() => { this.apiErrorSubject.next("Error: " + error); this.loadingSubject.next(false); }, 1000)
          setTimeout(() => { this.apiErrorSubject.next(); }, 5000)

        });
  }
  onValidate(accountNumber: string, bank: string, accountName: FormControl) {
    this.loadingSubject.next(true);
    this.valid.setErrors({
      validating: true
    })
    accountName.patchValue(''); accountName.updateValueAndValidity();
    const bankCode = this.banks.find(c => c.title == bank)?.code;
    if (bankCode) {
      let data = { bankcode: bankCode, accountnumber: accountNumber };
      this._commonService.accountEnquiry(data).pipe(map(r => {
        if (r.status == true) { accountName.patchValue(r.response.data); accountName.updateValueAndValidity(); this.displayMessage(true) } else {
          this.displayMessage(false)
        }
        return r;
      }), catchError(err => {
        this.displayMessage(false)
        console.error(err);
        return EMPTY;
      })).subscribe(c => {


      });
    } else {
      this.loadingSubject.next(false);
    }
  }

}
