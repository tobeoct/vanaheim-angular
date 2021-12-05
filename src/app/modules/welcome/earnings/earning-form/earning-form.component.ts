import { ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { VCValidators } from 'src/app/shared/validators/default.validators';
import { Subject, Observable, BehaviorSubject, from, EMPTY } from 'rxjs';
import { catchError, delay, map, take, tap } from 'rxjs/operators';
import { ElementStyle, ElementSize, ElementState } from 'src/app/shared/constants/enum';
import { ButtonOptions, AssetPath } from 'src/app/shared/constants/variables';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { IAssetPath } from 'src/app/shared/interfaces/assetpath';
import { EarningIndication, RateDetail } from '../earning';
import { EarningService } from '../../../../shared/services/earning/earning.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Store } from 'src/app/shared/helpers/store';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { AccountInfo } from 'src/app/modules/loan/shared/account-info/account-info';

@Component({
  selector: 'app-earning-form',
  templateUrl: './earning-form.component.html',
  styleUrls: ['./earning-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EarningFormComponent implements OnInit, AfterViewInit {
  private validationMessages: any = {
    email: 'Incorrect email format',
    required: "Please enter an email address",
    range: "Invalid amount: 100K - 50M"
  }
  earning: EarningIndication = new EarningIndication;
  form: FormGroup;
  buttonOptions: ButtonOptions = new ButtonOptions("I Am Interested", ElementStyle.default, "", ElementSize.default, true, ElementState.default);

  assetPaths: IAssetPath = new AssetPath;
  mobile: string = "sm-mobile";
  desktop: string = "sm-desktop";
  headerclass: string = "header";
  showModal: boolean = false;
  modalType: string = 'earning-indication';
  rateDetail: RateDetail;
  minAmount: number = 100000;
  maxAmount: number = 50000000;

  disableInputSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  disableInput$: Observable<boolean> = this.disableInputSubject.asObservable();
  get duration() {
    return this.form.get("duration") as FormControl || new FormControl();
  }
  get type() {
    return this.form.get("type") as FormControl || new FormControl();
  }
  get amount() {
    return this.form.get("amount") as FormControl || new FormControl();
  }
  get email() {
    return this.form.get("emailAddress") as FormControl || new FormControl();
  }
  get name() {
    return this.form.get("name") as FormControl || new FormControl();
  }
  get taxId() {
    return this.form.get("taxId") as FormControl || new FormControl();
  }
  get rate() {
    return this.form.get("rate") as FormControl || new FormControl();
  }
  get payout() {
    return this.form.get("payout") as FormControl || new FormControl();
  }
  get maturity() {
    return this.form.get("maturity") as FormControl || new FormControl();
  }

  get accountGroup() {
    return this.form.get("accountInfo") as FormGroup || new FormControl();
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
  get valid() {
    return this.form.get("valid") as FormControl || new FormControl();
  }
  titles: string[];
  banks: any[];
  delay$ = from([1]).pipe(delay(1000));

  @Output()
  onEmailEntered = new EventEmitter<string>();

  isLoggedIn$: Observable<boolean>;
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();

  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();

  amountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(250000);
  amount$: Observable<number> = this.amountSubject.asObservable();

  changedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  changed$: Observable<boolean> = this.changedSubject.asObservable();

  fromSignIn = "fromSignIn";

  accounts: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  accountsFromDb$: Observable<any[]> = this.accounts.asObservable();

  dataLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  dataLoading$: Observable<boolean> = this.dataLoadingSubject.asObservable();

  showFormSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showForm$: Observable<boolean> = this.showFormSubject.asObservable();
  constructor(private _fb: FormBuilder, private _router: Router, private _commonService: CommonService, private _store: Store, private _zone: NgZone, private _utility: Utility, private _validators: VCValidators, private _earningService: EarningService, private _authService: AuthService) {
  }
  ngAfterViewInit(): void {
    this.delay$.subscribe(c => {
      this.focus();
    })
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this._authService.isLoggedInSubject.asObservable();
    if (this._authService.isLoggedInSubject.value) {
      this.dataLoadingSubject.next(true);
      this.accountsFromDb$ = this._commonService.accounts().pipe(map((c: any[]) => {
        this.accounts.next(c);
        return c;
      }), take(1), tap(c => this.dataLoadingSubject.next(false)), catchError(c => { console.log(c); this.dataLoadingSubject.next(false); return EMPTY }));
    } else {
      this.showForm();
    }
    this.titles = this._store.titles;
    this.banks = this._store.banks;
    let accountInfo: AccountInfo = this._store.getEarningApplication()?.accountInfo;
    this.form = this.createForm(accountInfo);
    this.email.valueChanges.subscribe(value => {
      this.onEmailEntered.emit(value)
    })
    this.form.valueChanges.subscribe(form => {
      this._store.saveEarningApplication(form);
    })
    this.isLoggedIn$.subscribe(s => {
      if (s) {
        this.email.setValidators(null);
        this.email.updateValueAndValidity();
        this.name.setValidators(null);
        this.name.updateValueAndValidity();

      }
    })
  }

  createForm = (accountInfo: any) => {
    return this._fb.group({
      amount: ["100,000", [Validators.required, Validators.minLength(6), Validators.maxLength(10), this._validators.numberRange(this.minAmount, this.maxAmount)]],
      duration: [0, [Validators.required]],
      maturity: ['', [Validators.required]],
      taxId: [''],
      rate: [0, [Validators.required, Validators.min(15)]],
      payout: [0, [Validators.required]],
      emailAddress: [this._authService.userValue?.email ?? "", [Validators.required, Validators.email]],
      name: [this._authService.userValue?.firstName ?? "", [Validators.required, Validators.minLength(3)]],
      type: ["Monthly ROI", [Validators.required]],
      accountInfo: this.buildAccountGroup(accountInfo),
    })
  }
  buildAccountGroup = (accountInfo: AccountInfo) => {
    if (accountInfo) this.accounts.next([accountInfo]);
    let group = new FormGroup({
      id: new FormControl(accountInfo?.id ? accountInfo?.id : 0),
      bank: new FormControl(accountInfo?.bank ? accountInfo?.bank : '', [Validators.required]),
      accountNumber: new FormControl(accountInfo?.accountNumber ? accountInfo?.accountNumber : '', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      accountName: new FormControl(accountInfo?.accountName ? accountInfo?.accountName : '', [Validators.required])
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
  displayMessage(success: boolean) {
    this.loadingSubject.next(false);
    if (success) {
      this.valid.setErrors(null);
      this._utility.setSuccess("Account Verification Successful");
    } else {
      this._utility.setError("Account Verification Failed");
    }
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
  showForm() {
    this.showFormSubject.next(true);
  }
  focus() {
    this.focusSubject.next(true)
  }

  rateDetailChange(value: any) {
    this.rateDetail = value;
    const { rate, payout, maturity, duration } = value;
    this.maturity.patchValue(maturity);
    this.duration.patchValue(duration);
    this.rate.patchValue(rate);
    this.payout.patchValue(payout);
  }
  onError(value: any) {
    this.errorMessageSubject.next(value);
  }
  onChange(obj: any) {
    if (Object.keys(obj).includes("amount") && this._utility.convertToPlainNumber(obj.amount) != this.amountSubject.value) {

      this.amountSubject.next(this._utility.convertToPlainNumber(obj.amount));
    } else {
      this.changedSubject.next(true);

    }
  }
  setType(type: string) {
    this.type.patchValue(type);
  }
  onSubmit(event: any) {
    if (this._authService.isLoggedIn()) {
      this.disableInputSubject.next(false);
      this.loadingSubject.next(true);
      this._earningService.apply(this.form.value).pipe(take(1)).subscribe(
        data => {
          this._zone.run(() => {
            this.loadingSubject.next(false);
            this._utility.toggleLoading(true);
            setTimeout(() => { 
              this._utility.toggleLoading(false);this._earningService.success(data.message); this._earningService.showSuccess(true); }, 0);
            this.changedSubject.next(false)
            this.form.reset();
            this.form = this.createForm(null);
            this.form.updateValueAndValidity();
            this._store.removeEarningApplication();

          })
        },
        (error: string) => {
          this.loadingSubject.next(false);
          if (error == "Not Found") error = "You do not seem to be connected to the internet";
          setTimeout(() => { 
            this._utility.toggleLoading(false);this._earningService.error(error); this._earningService.showError(true); }, 0);
          this._store.removeEarningApplication();

        });
    } else {
      this._store.setItem(this.fromSignIn, true);
      this._earningService.showLogin(true);
    }


  }


}
