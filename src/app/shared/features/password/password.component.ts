import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VCValidators } from '@validators/default.validators';
import { Subscription } from 'rxjs';
import { BehaviorSubject, Observable, from, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
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
    return this.form.get("newPassword") as FormControl || new FormControl();
  }
  get confirmPassword() {
    return this.form.get("confirmPassword") as FormControl || new FormControl();
  }

  base: string;
  constructor(private _fb: FormBuilder,
    private _validators: VCValidators) {

  }
  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();
  ngOnInit(): void {

    this.form = this._fb.group({
      id: [0],
      oldPassword: ["", [Validators.required, this._validators.password]],
      newPassword: ["", [Validators.required, this._validators.password]],
      confirmPassword: ["", [Validators.required, this._validators.password]],

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

  }

  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }

}
