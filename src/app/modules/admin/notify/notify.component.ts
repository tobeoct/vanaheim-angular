import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, first, map, take } from 'rxjs/operators';
import { Utility } from 'src/app/shared/helpers/utility.service';
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
  customerIdsSubject: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  selectedCustomers$: Observable<number[]> = this.customerIdsSubject.asObservable();
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
  constructor(private _notifyService: NotifyService,private _utility:Utility, private _fb: FormBuilder, private _customerService: CustomerService) {

  }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    const customersInDb$ =this._customerService.customers();
    this.customers$ = customersInDb$.pipe(map(customers=>(customers.map((customer:any)=>({key:customer.id,value: `${customer.firstName} ${customer.lastName}`})))));
    let sub =customersInDb$.subscribe(c => {
      this.customers = c
    });
    this.form = this._fb.group({
      message: ["", [Validators.required]],
      messageType: ["", [Validators.required]],
      customerId: [""],
      notifyAll: [""]
    });

    this.customerId.valueChanges.subscribe(c => {
      let customerIds = this.customerIdsSubject.value;
      if (!customerIds.includes(c)) { customerIds.push(c) } else {
        customerIds = customerIds.filter(cu => cu != c);
      }
      this.customerIdsSubject.next(customerIds);
    })
    this.allSubscriptions.push(sub);
  }

  getCustomerName(id: any) {
    let customer = this.customers.find(c => c.id == id);
    return customer?.email;///customer?.firstName + " " + customer?.lastName;
  }

  onSubmit(form: FormGroup) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    let customerIds = this.customerIdsSubject.value;
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
          this.form.reset()
          this.customerIdsSubject.next([])
          this._utility.setSuccess(response);
        },
        error => {
           this._utility.setError("Error: " + error); this.loadingSubject.next(false);
        });
    this.allSubscriptions.push(sub);
  }

  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }

  remove(id:number){
    let customers = this.customerIdsSubject.value;
    customers = customers.filter(cu => cu != id);
    this.customerIdsSubject.next(customers);
  }
}
