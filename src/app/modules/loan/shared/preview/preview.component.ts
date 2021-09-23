import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { LoanResponse } from 'src/app/shared/poco/loan/loan-response';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';
import { BaseLoanApplication, BusinessLoanApplication, PersonalLoanApplication } from '../../loan-application';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit, AfterViewInit {

  loanApplication: any;
  isLoggedIn: boolean = false;
  form: FormGroup;
  loanType: string;
  key: string;
  category: string;
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  show2Subject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show2$: Observable<boolean> = this.show2Subject.asObservable();
  show3Subject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show3$: Observable<boolean> = this.show3Subject.asObservable();
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  apiErrorSubject: Subject<string> = new Subject<string>();
  apiError$: Observable<string> = this.apiErrorSubject.asObservable();
  apiSuccessSubject: Subject<string> = new Subject<string>();
  apiSuccess$: Observable<string> = this.apiSuccessSubject.asObservable();

  autoClickSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  autoClick$: Observable<boolean> = this.autoClickSubject.asObservable();
  fromSignIn = "fromSignIn";
  @ViewChild('button') button: ElementRef;
  constructor(private _store: Store, private _router: Router, private _zone: NgZone, private _fb: FormBuilder, private _authenticationService: AuthService, private _loanService: LoanService) { }
  ngAfterViewInit(): void {
    if (this._store.getItem(this.fromSignIn)) {
      this.moveToSubmit();
      // this.button.nativeElement.click();
      this.autoClickSubject.next(true)
      setTimeout(() => this.autoClickSubject.next(false), 500);
    }
  }

  ngOnInit(): void {

    this.isLoggedIn = this._authenticationService.isLoggedIn();
    this.loanType = this._store.loanType;
    this.category = this._store.loanCategory;
    this._store.titleSubject.next("Preview");
    this.form = this._fb.group({
      validated: [this._loanService.validateLoanApplication() ? 'valid' : '', [Validators.required]]
    })
    this.loanApplication = this._store.loanApplication[this._store.loanCategory];

  }
  moveToSubmit(): void {
    this.button.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }
  close = () => {
    this.showSubject.next(false);
  }
  close2 = () => {
    this.show2Subject.next(false);
    this.onNavigate("my/loans");
    // this.apiErrorSubject.next();
    // this.apiSuccessSubject.next();
  }
  close3 = () => {
    setTimeout(() => this.show3Subject.next(false), 0);
    // this.onNavigate("my/loans");
    // this.apiErrorSubject.next();
    // this.apiSuccessSubject.next();
  }
  toJson(value: any): any {
    return JSON.parse(value);
  }
  submitApplication(event: any) {
    if (this.isLoggedIn) {
      this.loadingSubject.next(true);
      let category = this._store.loanCategory;
      let a = this._store.loanApplication;
      let application: BaseLoanApplication;
      if (category == "business") {
        application = a["business"] as BusinessLoanApplication;
      } else {
        application = a["personal"] as PersonalLoanApplication;
      }

      let loanResponse = new LoanResponse();
      loanResponse.category = category;
      loanResponse.loanApplication = application;
      this._loanService.apply(loanResponse).pipe(take(1)).subscribe(
        data => {
          this._store.removeItem(this.fromSignIn); this._zone.run(() => {
            this.loadingSubject.next(false);
            setTimeout(() => this.apiSuccessSubject.next(data.loanRequestId), 0);
            this.show2Subject.next(true);
            this._store.removeApplication();
          })
        },
        (error: string) => {
          this.loadingSubject.next(false);
          this._store.removeItem(this.fromSignIn)
          // this._store.removeItem(this.fromSignIn)
          if (error == "Not Found") error = "You do not seem to be connected to the internet";
          setTimeout(() => this.apiErrorSubject.next(error), 0);
          this.show3Subject.next(true);
        });

    } else {
      this._store.setItem(this.fromSignIn, true);
      this.showSubject.next(true);
    }
  }
  onNavigate(route: string, params: any = {}): void {
    let base = this.isLoggedIn ? "my/loans" : "welcome/loans"
    const r = base + route;
    this._router.navigate([r], { queryParams: params })
  }
  login(): void {
    this._router.navigate(["auth/login"])
  }
}
