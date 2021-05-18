import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { VCValidators } from '@validators/default.validators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentComponent implements OnInit {
  form:FormGroup;
  docsToUpload:any[]=[];
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  requirements:any[];

  base:string;
  focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  focus$:Observable<boolean> = this.focusSubject.asObservable();
  delay$ = from([1]).pipe(delay(3000));
  loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  loading$:Observable<boolean> = this.loadingSubject.asObservable();
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();
  get documentArray(){
    return this.form.get("documentArray") as FormArray|| new FormControl();
  }
  get documentControls():FormControl[]{
    return this.documentArray.controls as FormControl[]|| [new FormControl()];
  }
  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store,
    private _validators:VCValidators, private _route: ActivatedRoute, private _cd: ChangeDetectorRef) { 
      this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
        this.base = x.url.replace(/\/[^\/]*$/, '/');
       });
    }

  ngOnInit(): void {
    this._store.titleSubject.next("Document Upload");
    this.requirements = this._store.loanTypes.find(type=>type.title==this._store.loanProduct)?.requirements || [];
    this.form = this._fb.group({
      
      documentArray:this._fb.array( [...this.buildDocuments()])
  });
  console.log(this.requirements)
  }

  buildDocuments=():FormControl[]=>{
    let groups:FormControl[] = [];
    for(let i=0;i<this.requirements.length;i++){
      groups.push(new FormControl('', [Validators.required]));
    }
    return groups
  }

  onSubmit=(form:FormGroup)=>{
    if(!form.valid) return;
    console.log(form.value);
    // const accountInfo:AccountInfo[] = [...form.value["accountArray"]]
    
    // {bank:this.bank.value,accountName:this.accountName.value, accountNumber:this.accountNumber.value};
    //  this._store.setAccountInfo(accountInfo);
    this.onNavigate("preview");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }

  onFileChange(event:any,id:number) {
    let reader = new FileReader();
   
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.documentControls[id].patchValue(file.name);
        this.docsToUpload[id] =  reader.result;
        // need to run CD since file load runs outside of zone
        this._cd.markForCheck();
      };
    }
  }
}
