import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginType } from '@models/helpers/enums/logintype';
import { VCValidators } from '@validators/default.validators';
import { Subscription } from 'rxjs';
import { BehaviorSubject, Observable, from, Subject } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-side-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class SidePasswordComponent implements OnInit {
  form: FormGroup;

  get oldPassword() {
    return this.form.get("oldPassword") as FormControl || new FormControl();
  }
  get newPassword() {
    return this.form.get("passwordGroup.newPassword") as FormControl || new FormControl();
  }
  get confirmPassword() {
    return this.form.get("passwordGroup.confirmPassword") as FormControl || new FormControl();
  }
  get passwordGroup() {
    return this.form.get("passwordGroup") as FormGroup || new FormControl();
  }

  base: string;
  constructor(private _fb: FormBuilder,
    private _validators: VCValidators, private _authService: AuthService) {

  }
  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();

  apiErrorSubject: Subject<string> = new Subject<string>();
  apiError$: Observable<string> = this.apiErrorSubject.asObservable();
  apiSuccessSubject: Subject<string> = new Subject<string>();
  apiSuccess$: Observable<string> = this.apiSuccessSubject.asObservable();
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  ngOnInit(): void {

    this.form = this._fb.group({
      id: [0],
      oldPassword: ["", [Validators.required, this._validators.password]],
      passwordGroup: this._fb.group({
        newPassword: ['', [Validators.required, this._validators.password]],
        confirmPassword: ['', [Validators.required, this._validators.password]]
      },
        { validator: this._validators.matcher("newPassword", "confirmPassword") }),

    });

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

    this.loadingSubject.next(true);
    this.change(this.oldPassword.value, this.newPassword.value);
  }
  change(oldPassword: string, newPassword: string) {
    this._authService.changePassword({ oldPassword, newPassword })
      .pipe(first())
      .subscribe(
        data => {
          this.apiSuccessSubject.next("Registration was successful");

        },
        error => {
          setTimeout(() => { this.apiErrorSubject.next("Error: " + error); this.loadingSubject.next(false); }, 1000)
          setTimeout(() => { this.apiErrorSubject.next(); }, 5000)

        });
  }

  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }

}
