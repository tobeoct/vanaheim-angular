
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, first } from 'rxjs/operators';

import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserCategory } from '@enums/usercategory';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { Subject, Observable, Subscription, BehaviorSubject, from } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { VCValidators } from 'src/app/shared/validators/default.validators';
import { LoginType } from '@models/helpers/enums/logintype';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  returnUrl: string;
  socialUser: SocialUser;
  isLoggedin: boolean;
  returnUsername: string;
  allSubscriptions: Subscription[] = [];
  get password() {
    return this.loginForm.get("password") as FormControl || new FormControl();
  }
  get username() {
    return this.loginForm.get("username") as FormControl || new FormControl();
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(3000));
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();

  apiSuccessSubject: Subject<string> = new Subject<string>();
  apiSuccess$: Observable<string> = this.apiSuccessSubject.asObservable();

  apiErrorSubject: Subject<string> = new Subject<string>();
  apiError$: Observable<string> = this.apiErrorSubject.asObservable();

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  loginAs: string;
  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService,
    private socialAuthService: SocialAuthService,
    private _router: Router,
    private _validators: VCValidators
  ) {
    this.loginAs = this._router.url.includes("admin") ? "Admin" : "Customer";
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // redirect to home if already logged in
    const user = this.authenticationService.userValue;
    if (this.authenticationService.isLoggedIn()) {
      if (user.category == UserCategory.Staff) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/my']);
      }
    }

  }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(sub => sub.unsubscribe());
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.returnUsername = params['username'];
    });
    this.loginForm = this._fb.group({
      username: [this.returnUsername ? this.returnUsername : "", [Validators.required, this._validators.username]],
      password: ['', [Validators.required, this._validators.password]]
    });

    // get return url from route parameters or default to '/'
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);
      if (this.isLoggedin) {
        this.login({ type: LoginType.Social, socialUser: user, loginAs: this.loginAs });//this.socialUser.id,"passwordQ","social",user)
      } else {
        alert("Error logging in")
      }
    });


  }
  ngAfterViewInit(): void {
    const sub = this.delay$.subscribe(c => {
      this.focus();
    })
    this.allSubscriptions.push(sub);
  }

  focus() {
    this.focusSubject.next(true)
  }
  onSubmit(form: FormGroup) {

    // stop here if form is invalid
    if (form.invalid) {
      return;
    }

    this.loadingSubject.next(true);
    this.login({ username: form.controls.username.value, password: form.controls.password.value, type: LoginType.Default, loginAs: this.loginAs })
  }
  login({ username, password, type, socialUser, loginAs }: any) {
    const sub = this.authenticationService.login({ username, password, type, socialUser, loginAs })
      .pipe(first())
      .subscribe(
        data => {
          this.loadingSubject.next(false);
          this.apiSuccessSubject.next("Welcome back " + data?.firstName);
          setTimeout(() => this.onNavigate(this.returnUrl), 2000);
        },
        error => {
          setTimeout(() => { this.apiErrorSubject.next("Error: " + error); this.loadingSubject.next(false); }, 1000)
          setTimeout(() => { this.apiErrorSubject.next(); }, 5000)
        });
    this.allSubscriptions.push(sub);
  }
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  onNavigate(route: string, params: any = {}): void {
    this._router.navigate([route], { queryParams: params })
  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }
}
