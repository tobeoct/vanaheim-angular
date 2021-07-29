import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs'; 
import { filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { RadioButtonItem } from 'src/app/shared/interfaces/radio-button-item';
const data:any[] = [
  {id:"Personal Loans",title:"Personal Loans", uniqueName:"PayMe",frequency:"Monthly",subtitle:"Buy my new phone, fix my car, pay my rent", description:"Get loans between NGN 25,000 and NGN 5 Million. Pay back monthly."},
  {id:"Business Loans",title:"Business Loans",uniqueName:"FundMe",frequency:"Monthly",subtitle:"Run and grow my business like a boss", description:"Get up to NGN 10 Million. Pay back monthly."},
  {id:"LPO Financing",title:"LPO Financing",frequency:"Monthly",subtitle:"I am a vendor, I am a contractor?", description:"Get up to NGN 10 Million for your local purchase orders. Payback monthly."},
  {id:"Float Me",uniqueName:"FloatMe", title:"Emergency/Quick Cash",frequency:"Daily",subtitle:"Fund my emergencies, I can make payments in less than one month", description:"Access up to NGN 10 Million. Payback daily.", action:"Float Me"},
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
  showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$:Observable<boolean> = this.showSubject.asObservable();
  show2Subject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show2$:Observable<boolean> = this.show2Subject.asObservable();
  items:RadioButtonItem[] = [{label:"For Individual",value:"Float Me (Personal)",selected:true},{label:"For Business",value:"Float Me (Business)",selected:false}]
  constructor(private _router:Router, private _fb:FormBuilder, private _store:Store, private _route:ActivatedRoute) { 
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
     this.base = x.url.replace(/\/[^\/]*$/, '/');
    });

  }
  
  get loanType(){
    return this.form.get("loanType") as FormControl|| new FormControl();
  }
  
  get choice(){
    return this.form.get("choice") as FormControl|| new FormControl();
  }
  

  ngOnInit(): void {
    this._store.titleSubject.next("Loan Type");
    this.form = this._fb.group({
      loanType: [!this._store.loanType?"":this._store.loanType,[Validators.required]],
      choice: ['Float Me (Personal)',[Validators.required]]
    })
    // let d = data.filter(d=>d.allowedTypes.includes(this.loanType));
    let d = data.map(c=>{
      if(c.id=="Float Me" && this._store.loanType.includes("Float Me")) c.title = this._store.loanType;
      return c;
    });
    this.dataSelectionSubject.next(d);
  }
  activate=(id:string)=>{
    this.activeTabSubject.next(id);
    if(id=="Float Me"){
      this.showSubject.next(true);
    }
      this.loanType.patchValue(id);
    
  }

  next=(event:any)=>{
   
   if((this.loanType.value!=this._store.loanType) && this._store.loanType){
    this.show2Subject.next(true);
   }else{
   this.continue()
  }
  //  this.onNavigate("welcome/loans/apply/applying-as");
  }

  continue=()=>{
    let type = this.loanType.value=="Float Me"?this.choice.value:this.loanType.value;
    this._store.setLoanType(type);
    if(this._router.url!="/welcome/loans"){
      this.onNavigate("applying-as");
    }
  }

  close(){
    this.show2Subject.next(false);
   let d = data.map(c=>{
      if(c.id=="Float Me") c.title = this.choice.value;
      return c;
    });
this.dataSelectionSubject.next(d);
    this.showSubject.next(false);
  }
  onNavigate(route:string,params:any={}):void{
    console.log("Loan Type",this.base)
    if(this.base=="/my/loans/") this.base+="apply/"
    const r =this.base+route;
    console.log(r);
    this._router.navigate([r],{queryParams: params})
  }
}
