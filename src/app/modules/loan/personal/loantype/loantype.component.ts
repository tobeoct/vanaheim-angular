import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs'; 
import { filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
const data:any[] = [
  {title:"Personal Loans",frequency:"Monthly",subtitle:"Buy my new phone, fix my car, pay my rent", description:"Get loans between NGN 25,000 and NGN 5 Million. Pay back monthly."},
  {title:"Business Loans",frequency:"Monthly",subtitle:"Run and grow my business like a boss", description:"Get up to NGN 10 Million. Pay back monthly."},
  {title:"LPO Financing",frequency:"Monthly",subtitle:"I am a vendor, I am a contractor?", description:"Get up to NGN 10 Million for your local purchase orders. Payback monthly."},
  {title:"Float Me",frequency:"Daily",subtitle:"Fund my emergencies, I can make payments in less than one month", description:"Access up to NGN 10 Million. Payback daily.", action:"Float Me"},
 ]
@Component({
  selector: 'app-loantype',
  templateUrl: './loantype.component.html',
  styleUrls: ['./loantype.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoantypeComponent implements OnInit {
  form:FormGroup;
  activeTabSubject:BehaviorSubject<string> = new BehaviorSubject<string>(this._store.loanType);
  activeTab$:Observable<string> = this.activeTabSubject.asObservable();
  base:string;
  dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store, private _route:ActivatedRoute) { 
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
     this.base = x.url.replace(/\/[^\/]*$/, '/');
    });

  }
  
  get loanType(){
    return this.form.get("loanType") as FormControl|| new FormControl();
  }
  

  ngOnInit(): void {
    this.form = this._fb.group({
      loanType: [!this._store.loanType?"":this._store.loanType,[Validators.required]],
      
    })
    // let d = data.filter(d=>d.allowedTypes.includes(this.loanType));
    this.dataSelectionSubject.next(data);
  }
  activate=(id:string)=>{
    this.activeTabSubject.next(id);
    this.loanType.patchValue(id);
  }

  next=(event:any)=>{
   
    this._store.setLoanType(this.loanType.value);
    if(this._router.url!="/welcome/loans"){
      this.onNavigate("applying-as");
    }
  //  this.onNavigate("welcome/loans/apply/applying-as");
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    console.log(r)
    this._router.navigate([r],{queryParams: params})
  }
}
