import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import e = require('express');
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoanStore, Store } from 'src/app/shared/helpers/store';
import { RadioButtonItem } from 'src/app/shared/interfaces/radio-button-item';

@Component({
  selector: 'app-loantype',
  templateUrl: './loantype.component.html',
  styleUrls: ['./loantype.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoantypeComponent implements OnInit {
  form: FormGroup;
  activeTabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._loanStore.loanType);
  activeTab$: Observable<string> = this.activeTabSubject.asObservable();
  base: string;
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  show2Subject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show2$: Observable<boolean> = this.show2Subject.asObservable();
  items: RadioButtonItem[] = [{ label: "For Individual", value: "FloatMe Loan (Individual)", selected: true }, { label: "For Business", value: "FloatMe Loan (Business)", selected: false }]
  constructor(private _router: Router, private _fb: FormBuilder, private _store: Store,private _loanStore:LoanStore, private _route: ActivatedRoute) {
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
    this._loanStore.titleSubject.next("Loan Product");
    this.form = this._fb.group({
      loanType: [!this._loanStore.loanType ? "" : this._loanStore.loanType, [Validators.required]],
      choice: ['FloatMe Loan (Individual)', [Validators.required]]
    })
    // let d = data.filter(d=>d.allowedTypes.includes(this.loanType));
    let d = this._loanStore.loanProducts.map(c => {
      if (c.id == "FloatMe Loan" && this._loanStore.loanType.includes("FloatMe")) c.title = this._loanStore.loanType;
      return c;
    });
    this.dataSelectionSubject.next(d);
  }
  activate = (id: string) => {
    this.activeTabSubject.next(id);

    this.loanType.patchValue(id);
    if (id == "FloatMe Loan") {
      this.showSubject.next(true);
    } else {
      this.next()
    }
  }

  next = () => {

    if ((this.loanType.value != this._loanStore.loanType) && this._loanStore.loanType) {
      this.show2Subject.next(true);
    } else {
      this.continue()
    }
    //  this.onNavigate("welcome/loans/apply/applying-as");
  }

  continue = () => {
    let type = this.loanType.value == "FloatMe Loan" ? this.choice.value : this.loanType.value;
    this._loanStore.setLoanType(type);
    if (this._router.url != "/welcome/loans") {
      this.onNavigate("applying-as");
    }
  }

  close() {
    this.show2Subject.next(false);
    let d = this._loanStore.loanProducts.map(c => {
      if (c.id == "FloatMe Loan") c.title = this.choice.value;
      return c;
    });
    this.dataSelectionSubject.next(d);
    this.showSubject.next(false);
  }
  onNavigate(route: string, params: any = {}): void {
    let url = this.base;
    if (url == "/my/loans/") url += "apply/"
    url += route;
    this._router.navigate([url], { queryParams: params })
  }
}
