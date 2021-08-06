import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import e = require('express');
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { RadioButtonItem } from 'src/app/shared/interfaces/radio-button-item';
const data: any[] = [
  { id: "PayMe Loan", title: "Salary Earners' Loans", uniqueName: "PayMe Loan", frequency: "Monthly", description: "Need a loan for house rent, to buy a new phone or to fix your car?.Take personal loans between NGN 25,000 to NGN 5M and pay back monthly." },
  { id: "FundMe Loan", title: "Business (SME) Loan", uniqueName: "FundMe Loan", frequency: "Monthly", description: "Need a loan to grow your business?.Get business loans up to NGN 5M with no application fees at affordable interest rates." },
  { id: "LPO Finance", title: "Local Purchase Order", uniqueName: "LPO Finance", frequency: "Monthly", description: "Are you a contractor, vendor or a supplier in need of funding to execute a project?.Get access to loans up to NGN 5M for your local purchase order projects." },
  { id: "FloatMe Loan", uniqueName: "FloatMe Loan", title: "Emergency/Quick Cash", frequency: "Daily", description: "Dealing with emergency expenses at mid-month?.Get loans up to NGN 5M naira and pay back daily or weekly in."},
  { id: "Line Of Credit", uniqueName: "Line Of Credit", title: "Line Of Credit", frequency: "Monthly", description: "Get access to personal/business loans, withdraw by instalment as needed and repay as agreed." },

]
@Component({
  selector: 'app-loantype',
  templateUrl: './loantype.component.html',
  styleUrls: ['./loantype.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoantypeComponent implements OnInit {
  form: FormGroup;
  activeTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanType);
  activeTab$: Observable<string> = this.activeTabSubject.asObservable();
  base: string;
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  show2Subject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show2$: Observable<boolean> = this.show2Subject.asObservable();
  items: RadioButtonItem[] = [{ label: "For Individual", value: "FloatMe Loan (Individual)", selected: true }, { label: "For Business", value: "FloatMe Loan (Business)", selected: false }]
  constructor(private _router: Router, private _fb: FormBuilder, private _store: Store, private _route: ActivatedRoute) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
    });

  }

  get loanType() {
    return this.form.get("loanType") as FormControl || new FormControl();
  }

  get choice() {
    return this.form.get("choice") as FormControl || new FormControl();
  }


  ngOnInit(): void {
    this._store.titleSubject.next("Loan Product");
    this.form = this._fb.group({
      loanType: [!this._store.loanType ? "" : this._store.loanType, [Validators.required]],
      choice: ['FloatMe Loan (Individual)', [Validators.required]]
    })
    // let d = data.filter(d=>d.allowedTypes.includes(this.loanType));
    let d = data.map(c => {
      if (c.id == "FloatMe Loan" && this._store.loanType.includes("FloatMe")) c.title = this._store.loanType;
      return c;
    });
    this.dataSelectionSubject.next(d);
  }
  activate = (id: string) => {
    this.activeTabSubject.next(id);
    
    this.loanType.patchValue(id);
    if (id == "FloatMe Loan") {
      this.showSubject.next(true);
    }else{
    this.next()
    }
  }

  next = () => {

    if ((this.loanType.value != this._store.loanType) && this._store.loanType) {
      this.show2Subject.next(true);
    } else {
      this.continue()
    }
    //  this.onNavigate("welcome/loans/apply/applying-as");
  }

  continue = () => {
    let type = this.loanType.value == "FloatMe Loan" ? this.choice.value : this.loanType.value;
    this._store.setLoanType(type);
    if (this._router.url != "/welcome/loans") {
      this.onNavigate("applying-as");
    }
  }

  close() {
    this.show2Subject.next(false);
    let d = data.map(c => {
      if (c.id == "FloatMe Loan") c.title = this.choice.value;
      return c;
    });
    this.dataSelectionSubject.next(d);
    this.showSubject.next(false);
  }
  onNavigate(route: string, params: any = {}): void {
    console.log("Loan Type", this.base)
    if (this.base == "/my/loans/") this.base += "apply/"
    const r = this.base + route;
    console.log(r);
    this._router.navigate([r], { queryParams: params })
  }
}
