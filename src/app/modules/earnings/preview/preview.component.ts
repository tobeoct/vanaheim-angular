import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { EarningsStore, LoanStore, Store } from 'src/app/shared/helpers/store';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { LoanResponse } from 'src/app/shared/poco/loan/loan-response';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { EarningService } from 'src/app/shared/services/earning/earning.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit, AfterViewInit {

  earningsApplication: any;
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
  fromSignIn = "earningFromSignIn";
  @ViewChild('button') button: ElementRef;
  constructor(private _store: Store, private _earningsStore: EarningsStore, private _utility: Utility, private _router: Router, private _zone: NgZone, private _fb: FormBuilder, private _authenticationService: AuthService, private _earningService: EarningService) { }
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

    this._earningsStore.titleSubject.next("Preview");
    this.form = this._fb.group({
      validated: [this._earningService.validateApplication() ? 'valid' : '', [Validators.required]]
    })
    this.earningsApplication = this._earningsStore.earningsApplication;

  }
  moveToSubmit(): void {
    this.button.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }
  close = () => {
    this.showSubject.next(false);
  }
  close2 = () => {
    this.show2Subject.next(false);
    this._earningService.continueApplication(false)
    this._router.navigate(["my/earnings"])
    // this.apiErrorSubject.next();
    // this.apiSuccessSubject.next();
  }
  close3 = () => {
    setTimeout(() => this.show3Subject.next(false), 0);
  }
  toJson(value: any): any {
    return JSON.parse(value);
  }
  submitApplication(event: any) {
    if (this.isLoggedIn) {
      this.loadingSubject.next(true);
      this._utility.toggleLoading(true);
      this._earningService.apply(this.earningsApplication).pipe(take(1)).subscribe(
        data => {
          this._zone.run(() => {
            this.loadingSubject.next(false);
            setTimeout(() => {
              this._utility.toggleLoading(false); this._earningService.success(data.message); this._earningService.showSuccess(true);
            }, 0);

            this._earningsStore.removeApplication();

          })
        },
        (error: string) => {
          this.loadingSubject.next(false);
          if (error == "Not Found") error = "You do not seem to be connected to the internet";
          setTimeout(() => {
            this._utility.toggleLoading(false); this._earningService.error(error); this._earningService.showError(true);
          }, 0);
          // this._earningsStore.removeApplication();

        });

    } else {
      this._store.setItem(this.fromSignIn, true);
      this.showSubject.next(true);
    }
  }
  onNavigate(route: string, params: any = {}): void {
    let base = this.isLoggedIn ? "my/earnings/apply/" : "welcome/earnings/apply/"
    const r = base + route;
    this._router.navigate([r], { queryParams: params })
  }
  login(): void {
    this._router.navigate(["auth/login"])
  }
}
