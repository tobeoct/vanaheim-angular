import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { VCValidators } from '@validators/default.validators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { EarningsStore, LoanStore, Store } from 'src/app/shared/helpers/store';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { IdentificationType, MeansOfIdentification } from '../earnings-application';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentUploadComponent implements OnInit {
  form: FormGroup;
  docsToUpload: any;
  meansOfIdentification: MeansOfIdentification;
  isLoggedIn: boolean = true;
  base: string;
  allowedExtensions =
    /(\.jpg|\.jpeg|\.png|\.xls|\.ppt|\.pptx|\.xlsx|\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd)$/i;
  focusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  focus$: Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(3000));
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject: Subject<any> = new Subject<any>();
  errorMessage$: Observable<any> = this.errorMessageSubject.asObservable();
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  show2Subject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show2$: Observable<boolean> = this.show2Subject.asObservable();
  types: any[] = Object.values(IdentificationType);
  get document() {
    return this.form.get("document") as FormControl || new FormControl();
  }
  get idNumber() {
    return this.form.get("idNumber") as FormControl || new FormControl();
  }
  get issueDate() {
    return this.form.get("issueDate") as FormControl || new FormControl();
  }
  get expiryDate() {
    return this.form.get("expiryDate") as FormControl || new FormControl();
  }
  get type() {
    return this.form.get("type") as FormControl || new FormControl();
  }
  constructor(private _router: Router, private _fb: FormBuilder, private _store: Store, private _earningStore: EarningsStore,
    private _validators: VCValidators, private _route: ActivatedRoute, private _cd: ChangeDetectorRef, private _authenticationService: AuthService) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
    });
  }

  ngOnInit(): void {
    this._earningStore.titleSubject.next("Means Of Identification");

    this.meansOfIdentification = this._earningStore.meansOfIdentification as MeansOfIdentification;
    this.form = this._fb.group({
      type: [this.meansOfIdentification?.type ? this.meansOfIdentification?.type : "", [Validators.required]],
      document: [this.meansOfIdentification?.document ? this.meansOfIdentification?.document.label : '', [Validators.required]],
      idNumber: [this.meansOfIdentification?.idNumber ? this.meansOfIdentification?.idNumber : "", [Validators.required]],
      issueDate: [this.meansOfIdentification?.issueDate ? this.meansOfIdentification?.issueDate : ""],
      expiryDate: [this.meansOfIdentification?.expiryDate ? this.meansOfIdentification?.expiryDate : ""]
    });
    this.isLoggedIn = this._authenticationService.isLoggedIn();
  }



  onSubmit = (form: FormGroup) => {
    if (!form.valid) return;
   
    this.store();
    this.onNavigate("preview");
  }
  onNavigate(route: string, params: any = {}): void {
    const r = this.base + route;
    this._router.navigate([r], { queryParams: params })
  }
  onError(value: any): void {
    this.errorMessageSubject.next(value);
  }
  onClick(event: any) {
    if (!this.isLoggedIn) {
      event.preventDefault();
      event.stopPropagation();
      this.showSubject.next(true);
    }
  }
  onFileChange(result: any) {
    if (result.error) {
      if (result.message == "Invalid file type") { this.show2Subject.next(true) } else { this.showSubject.next(true); }
    } else {
      this.docsToUpload = result;
      this.store();
    }
  }
  store(){
    
    let meansOfIdentification: MeansOfIdentification = { type: this.type.value, document: { fileName: this.docsToUpload ? this.docsToUpload.name : this.meansOfIdentification?.document?.fileName, id: this.docsToUpload ? this.docsToUpload.id : this.meansOfIdentification?.document?.id, label: this.docsToUpload ? this.docsToUpload.requirement : this.meansOfIdentification?.document?.label }, idNumber: this.idNumber.value, issueDate: this.issueDate.value, expiryDate: this.expiryDate.value };
    this._earningStore.setMeansOfIdentification(meansOfIdentification);
  }
  login(): void {
    this._router.navigate(["auth/login"])
  }
  close() {
    this.showSubject.next(false);
    this.show2Subject.next(false);
  }
}
