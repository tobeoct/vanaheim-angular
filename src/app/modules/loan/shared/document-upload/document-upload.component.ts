import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { VCValidators } from '@validators/default.validators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentUploadComponent implements OnInit {
  form:FormGroup;
  docsToUpload:any[]=[];
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanProduct);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  requirements:any[];
  documents:any[];
  isLoggedIn:boolean = true;
  base:string;
allowedExtensions =
/(\.jpg|\.jpeg|\.png|\.xls|\.ppt|\.pptx|\.xlsx|\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd)$/i;
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
    private _validators:VCValidators, private _route: ActivatedRoute, private _cd: ChangeDetectorRef, private _authenticationService:AuthService) { 
      this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
        this.base = x.url.replace(/\/[^\/]*$/, '/');
       });
    }

  ngOnInit(): void {
    this._store.titleSubject.next("Document Upload");
    this.requirements = this._store.loanTypes.find(type=>type.title==this._store.loanProduct)?.requirements || [];
    this.documents = this._store.documents as any[];
    this.form = this._fb.group({
      
      documentArray:this._fb.array( [...this.buildDocuments()])
  });
  this.isLoggedIn=this._authenticationService.isLoggedIn();
  }

  buildDocuments=():FormControl[]=>{
    let groups:FormControl[] = [];
    for(let i=0;i<this.requirements.length;i++){
      let requirement =this.requirements[i];
      groups.push(new FormControl(this.documents[requirement.title]?this.documents[requirement.title].name:''));
      //, [this._validators.filterFile(this.allowedExtensions)]
    }
    return groups
  }

  onSubmit=(form:FormGroup)=>{
    if(!form.valid) return;
    // if(this.docsToUpload)
    //const documents:any[] = [...form.value["documentArray"]]
    let documents:any={};
    let f=form.value["documentArray"] as any[]; 
    console.log(f)
    this.docsToUpload.forEach((doc,i) => {
      // let doc:any = f[i];
     documents[doc.requirement] = {name:doc.name,id:doc.id}
    //  documents.push(document);
    });
    // let arr = form.value["documentArray"] as string[];
    // for(let i=0;i<arr.length;i++){
    //   documents.push({[this.requirements[i].title]:arr[i]});
    // }
     this._store.setDocuments(documents);
    this.onNavigate("preview");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
  onError(value:any):void{
    this.errorMessageSubject.next(value);
  }

  onFileChange(result:any,id:number) {
     this.docsToUpload[id] = result;
  }
}
