import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VCValidators } from 'src/app/shared/validators/default.validators';
import { Subscription } from 'rxjs';
import { Subject, Observable, BehaviorSubject, from } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { AssetPath } from 'src/app/shared/constants/variables';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { IAssetPath } from 'src/app/shared/interfaces/assetpath';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit, OnDestroy {

  form: FormGroup;
  allSubscriptions: Subscription[] = [];
  assetPaths: IAssetPath = new AssetPath;
  get username() {
    return this.form.get("username") as FormControl || new FormControl();
  }
  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  returnUsername: string;

  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  constructor(private _fb: FormBuilder,
    private route: ActivatedRoute, private _utility: Utility, private _router: Router, private _validators: VCValidators,
    private authenticationService: AuthService) { }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(sub => sub.unsubscribe());
  }



  focus() {
    this.focusSubject.next(true)
  }

  ngAfterViewInit(): void {
    const sub = this.delay$.subscribe(c => {
      this.focus();
    })
    this.allSubscriptions.push(sub);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.returnUsername = params['username'];
    });
    this.form = this._fb.group({
      username: [this.returnUsername ? this.returnUsername : "", [Validators.required, this._validators.username]]
    })


  }

  onSubmit(form: FormGroup) {

    // stop here if form is invalid
    if (form.invalid) {
      return;
    }

    this.loadingSubject.next(true);
    this.verify(form.controls.username.value?.toLowerCase())
  }
  verify(username: string) {
    const sub = this.authenticationService.verify({ username })
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.loadingSubject.next(false);
          if (data.verified == true) { this.onNavigate('auth/login', { username: username }) }
          else { this.onNavigate('auth/register', { email: username }) }
        },
        (error: any) => {
          this._utility.setError("Error: " + error); this.loadingSubject.next(false);

        });

    this.allSubscriptions.push(sub);
  }

  onNavigate(route: string, params: any = {}): void {
    this._router.navigate([route], { queryParams: params })
  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }

}
