import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
const data:any[] = [
  {title:"Salary Earner",allowedTypes:["Personal Loans", "Float Me - Personal"], description:"I work in an organisation and get paid a salary"},
  {title:"Business Owner",allowedTypes:["Personal Loans","Business Loans", "Float Me - Business", "LPO Financing"], description:"I work in an organisation and get paid a salary"},
  {title:"Corporate",allowedTypes:["Business Loans", "Float Me - Business", "LPO Financing"], description:"I work in an organisation and get paid a salary"},
  {title:"Contractor",allowedTypes:["Business Loans", "Float Me - Business", "LPO Financing"], description:"I work in an organisation and get paid a salary"},
]
@Component({
  selector: 'app-applying-as',
  templateUrl: './applying-as.component.html',
  styleUrls: ['./applying-as.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ApplyingAsComponent implements OnInit {
   loanType:string;
  form:FormGroup;
  base:string;
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.applyingAs);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  
  get applyingAs(){
    return this.form.get("applyingAs") as FormControl|| new FormControl();
  }

  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store, private _route:ActivatedRoute) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
     });
   }

  ngOnInit(): void {
    this.loanType = this._store.loanType;
    this.form = this._fb.group({
      applyingAs: [!this._store.applyingAs?"":this._store.applyingAs,[Validators.required]],
      
    })
    let d = data.filter(d=>d.allowedTypes.includes(this.loanType));
    this.dataSelectionSubject.next(d);
    
  }

  activate=(id:string)=>{
    this.activeTabSubject.next(id);
    this.applyingAs.patchValue(id);
  }

  next=(event:any)=>{
    this._store.setApplyingAs(this.applyingAs.value);
    if(this._router.url!="/welcome/loans"){
      this.onNavigate("loan-product");
    }
  //  this.onNavigate("welcome/loans/apply/applying-as");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
}
