import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, first, take } from 'rxjs/operators';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import { NotifyService } from './notify.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit, OnDestroy {
  allSubscriptions: Subscription[] = [];
  customers$: Observable<any[]>
  form: FormGroup;
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
  customersSubject: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  selectedCustomers$: Observable<number[]> = this.customersSubject.asObservable();
  customers: any[];
  messageTypes: any[] = [{ label: "Announcements" }, { label: "Update" }];

  get notifyAll() {
    return this.form.get("notifyAll") as FormControl || new FormControl();
  }
  get message() {
    return this.form.get("message") as FormControl || new FormControl();
  }
  get messageType() {
    return this.form.get("messageType") as FormControl || new FormControl();
  }

  get customerId() {
    return this.form.get("customerId") as FormControl || new FormControl();
  }
  constructor(private _notifyService: NotifyService, private _fb: FormBuilder, private _customerService: CustomerService) {

  }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.customers$ = this._customerService.customers();
    let sub = this.customers$.subscribe(c => {
      this.customers = c;
    });
    this.form = this._fb.group({
      message: ["", [Validators.required]],
      messageType: ["", [Validators.required]],
      customerId: [""],
      notifyAll: [""]
    });

    this.customerId.valueChanges.subscribe(c => {
      let customers = this.customersSubject.value;
      if (!customers.includes(c)) { customers.push(c) } else {
        customers = customers.filter(cu => cu != c);
      }
      this.customersSubject.next(customers);
    })
    this.allSubscriptions.push(sub);
  }

  getCustomerName(id: any) {
    let customer = this.customers.find(c => c.id == id);
    return customer.email;///customer?.firstName + " " + customer?.lastName;
  }

  onSubmit(form: FormGroup) {
    console.log("Submitting");
    // stop here if form is invalid
    if (form.invalid) {
      console.log("Form Invalid");
      return;
    }
    let customerIds = this.customersSubject.value;
    if (this.notifyAll.value) {
      customerIds = this.customers.map(c => c.id);
    }
    this.notify(this.message.value, this.messageType.value, customerIds);

    this.loadingSubject.next(true);
  }
  notify(message: string, type: string, customerIDs: number[]) {
    const sub = this._notifyService.notify({ message, type, customerIDs })
      .pipe(first())
      .subscribe(
        response => {
          this.loadingSubject.next(false);
          this.apiSuccessSubject.next(response);
          setTimeout(() => { this.apiSuccessSubject.next(); }, 5000)
        },
        error => {
          setTimeout(() => { this.apiErrorSubject.next("Error: " + error); this.loadingSubject.next(false); }, 1000)
          setTimeout(() => { this.apiErrorSubject.next(); }, 5000)
        });
    this.allSubscriptions.push(sub);
  }

  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }

  remove(id:number){
    let customers = this.customersSubject.value;
    customers = customers.filter(cu => cu != id);
    this.customersSubject.next(customers);
  }
}
