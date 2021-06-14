import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, EMPTY, from, Observable, Subject, Subscription } from 'rxjs';
import { catchError, delay, filter, map, take, tap } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { CollateralInfo } from './collateral-info';
import { Document } from '../../shared/document-upload/document';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';

@Component({
  selector: 'app-collateral-info',
  templateUrl: './collateral-info.component.html',
  styleUrls: ['./collateral-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CollateralInfoComponent implements OnInit {
  form:FormGroup;
  types:string[];
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  
  get collateralId(){
    return this.form.get("id") as FormControl|| new FormControl();
  }

  get type(){
    return this.form.get("type") as FormControl|| new FormControl();
  }
  get description(){
    return this.form.get("description") as FormControl|| new FormControl();
  }
  get valuation(){
    return this.form.get("valuationAmount") as FormControl|| new FormControl();
  }

  get owner(){
    return this.form.get("owner") as FormControl|| new FormControl();
  }

  get document(){
    return this.form.get("document") as FormControl|| new FormControl();
  }

  get hasDocument(){
    return this.form.get("hasDocument") as FormControl|| new FormControl();
  }

  collaterals:BehaviorSubject<any[]>=new BehaviorSubject<any[]>([]);
  collateralsFromDb$:Observable<any[]> = this.collaterals.asObservable();
    base:string;
  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store,private _customerService:CustomerService,
    private _validators:VCValidators,private _utility:Utility, private _route: ActivatedRoute, private _authService:AuthService) {
      this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
        this.base = x.url.replace(/\/[^\/]*$/, '/');
       });
     }

  focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  focus$:Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  loading$:Observable<boolean> = this.loadingSubject.asObservable();

  dataLoadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  dataLoading$:Observable<boolean> = this.dataLoadingSubject.asObservable();
  isLoggedIn:boolean;
  showFormSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  showForm$:Observable<boolean> = this.showFormSubject.asObservable();

  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();
  allSubscriptions:Subscription[]=[];
  ngOnInit(): void { 
    this.isLoggedIn = this._authService.isLoggedIn();
    if(this.isLoggedIn){
      this.dataLoadingSubject.next(true);
      this.collateralsFromDb$ = this._customerService.collaterals().pipe(map((c:any[])=>{
        this.collaterals.next(c);
        this.patchValue(c)
        return c;
      }),take(1),tap(c=>this.dataLoadingSubject.next(false)), catchError(c=>{console.log(c);this.dataLoadingSubject.next(false);return EMPTY}));
      }else{
        this.showForm();
      }
    const collateralInfo = this._store.collateralInfo as CollateralInfo;
    this.form = this._fb.group({
      id:[0],
      type: [collateralInfo.type?collateralInfo.type:"",[Validators.required]],
      description: [collateralInfo.description?collateralInfo.description:"",[Validators.required, Validators.minLength(5)]],
      valuationAmount: [collateralInfo.valuation?collateralInfo.valuation:"",[Validators.required]],
      owner: [collateralInfo.owner?collateralInfo.owner:"",[Validators.required, Validators.minLength(2)]],
      document: [collateralInfo.document?.fileName?collateralInfo.document.fileName:""],
      hasDocument: [collateralInfo.document?.fileName?'true':'']
      
  });
    this._store.titleSubject.next("Collateral Information");
    this.types = this._store.collateralTypes;
    this.hasDocument.valueChanges.subscribe(d=>{
      if(this.hasDocument.value=="true"){
        this.document.setValidators(Validators.required);
      }
    });
    this.collateralId.valueChanges.subscribe(c=>{
      if(c>0){
        
        this.setValue(this.collaterals.value.find(e=>e.id==c));
      }
    })
  }

  focus(){
    this.focusSubject.next(true)
  }
  showForm(){
    this.showFormSubject.next(true);
  }

  patchValue(collateral:any){
    if(collateral){
    if(!this.type.value&&collateral.type){
      this.type.patchValue(collateral.type);
    }
    if(!this.owner.value&&collateral.owner){
      this.owner.patchValue(collateral.owner);
    }
    if(!this.description.value&&collateral.description){
      this.description.patchValue(collateral.description);
    }
   
    if(!this.valuation.value&&collateral.valuation){
      this.valuation.patchValue(collateral.valuation);
    }
    if(!this.hasDocument.value &&collateral.document){
      this.hasDocument.patchValue('true');
    }
    if(!this.document.value &&collateral.document){
      this.document.patchValue(collateral.document?.fileName);
    }
    
    }
    }
    setValue(collateral:any){
      if(collateral){
        if(collateral.type){
          this.type.patchValue(collateral.type);
        }
        if(collateral.owner){
          this.owner.patchValue(collateral.owner);
        }
        if(collateral.description){
          this.description.patchValue(collateral.description);
        }
       
        if(collateral.valuation){
          this.valuation.patchValue(collateral.valuation);
        }
        if(collateral.document){
          this.hasDocument.patchValue('true');
        }
        if(collateral.document){
          this.document.patchValue(collateral.document?.fileName);
        }
        
        }
      }
ngAfterViewInit(): void {
    const sub = this.delay$.subscribe(c=>{
        this.focus();    
    })
    this.allSubscriptions.push(sub);
}
ngOnDestroy(): void {
  this.allSubscriptions.forEach(sub=>sub.unsubscribe());
}

  onSubmit=(form:FormGroup)=>{
    if(!form.valid) return;
    let d = new Document();
    d.fileName = this.document.value;
    const collateralInfo:CollateralInfo ={id:0,document:d,owner:this.owner.value, valuation: this._utility.currencyFormatter(this.valuation.value), type: this.type.value, description: this.description.value};
     this._store.setCollateralInfo(collateralInfo);
    this.onNavigate("account-info");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }
}
