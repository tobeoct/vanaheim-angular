import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VCValidators } from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { AdditionalInfo } from './additional-info';
const data: any[] = [
  { title: "PayDay Loans", allowedApplicant: ["Salary Earner", "Business Owner"], allowedTypes: ["Personal Loans", "Float Me - Personal"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Personal Line Of Credit", allowedApplicant: ["Salary Earner", "Business Owner"], allowedTypes: ["Personal Loans", "Float Me - Personal"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "LPO Financing", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business", "LPO Financing"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Business Loans", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business"], description: "Spread your loan payment, repay when you get your salary" },
  { title: "Business Line Of Credit", allowedApplicant: ["Business Owner", "Corporate", "Contractor"], allowedTypes: ["Business Loans", "Float Me - Business"], description: "Spread your loan payment, repay when you get your salary" },
]
@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalInfoComponent implements OnInit {
  lType: string;
  applyingAs: string;
  loanProduct: string;
  form: FormGroup;
  activeTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$: Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();

  get email() {
    return this.form.get("email") as FormControl || new FormControl();
  }

  get phoneNumber() {
    return this.form.get("phoneNumber") as FormControl || new FormControl();
  }
  get name() {
    return this.form.get("name") as FormControl || new FormControl();
  }

  base: string;
  constructor(private _router: Router, private _fb: FormBuilder, private _store: Store,
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
  ngOnInit(): void {
    this.lType = this._store.loanType;
    this.applyingAs = this._store.applyingAs;
    this.loanProduct = this._store.loanProduct;
    const additionalInfo = this._store.additionalInfo as AdditionalInfo;
    this.form = this._fb.group({
      name: [additionalInfo.preferredName ? additionalInfo.preferredName : "", [Validators.required, Validators.minLength(3)]],
      email: [additionalInfo.preferredEmail ? additionalInfo.preferredEmail : "", [Validators.required, Validators.email]],
      phoneNumber: [additionalInfo.preferredPhoneNumber ? additionalInfo.preferredPhoneNumber : "", [Validators.required, this._validators.phone]]
    });
    let d = data.filter(d => d.allowedTypes.includes(this.lType) && d.allowedApplicant.includes(this.applyingAs));
    this.dataSelectionSubject.next(d);
    this._store.titleSubject.next("Contact Information");
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
  onSubmit = (event: any) => {
    this._store.setAdditionalInfo({ preferredName: this.name.value, preferredEmail: this.email.value, preferredPhoneNumber: this.phoneNumber.value });
    this.onNavigate("company-info");
  }
  onNavigate(route: string, params: any = {}): void {
    const r = this.base + route;
    this._router.navigate([r], { queryParams: params })
  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }
}
