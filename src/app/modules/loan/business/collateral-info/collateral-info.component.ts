import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { CollateralInfo } from './collateral-info';
import { Document } from '../../shared/document-upload/document';
import { Utility } from 'src/app/shared/helpers/utility.service';

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


    base:string;
  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store,
    private _validators:VCValidators,private _utility:Utility, private _route: ActivatedRoute) {
      this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
        this.base = x.url.replace(/\/[^\/]*$/, '/');
       });
     }

  focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  focus$:Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(1000));
  loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  loading$:Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();
  allSubscriptions:Subscription[]=[];
  ngOnInit(): void {
    const collateralInfo = this._store.collateralInfo as CollateralInfo;
    this.form = this._fb.group({
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
    })
  }

  focus(){
    this.focusSubject.next(true)
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
