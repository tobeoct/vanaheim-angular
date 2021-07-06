import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RequestService } from './request.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  loans$:Observable<any[]>;

  loanStatuses:any[] = [{label:"Pending",key:"new"},{label:"Processing",key:"processing"},{label:"UpdateRequired",key:"update"},{label:"Declined",key:"declined"},{label:"Approved",key:"approved"}, {label:"Funded",key:"funded"}];
ctrl:FormControl = new FormControl("");
  showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$:Observable<boolean> = this.showSubject.asObservable();

  
  showConfirmSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showConfirm$:Observable<boolean> = this.showConfirmSubject.asObservable();
  
  indicatorSubject:BehaviorSubject<string> = new BehaviorSubject<string>("");
  indicator$:Observable<string> = this.indicatorSubject.asObservable();

  lastStatusSubject:BehaviorSubject<string> = new BehaviorSubject<string>("");
  lastStatus$:Observable<string> = this.lastStatusSubject.asObservable();

  loanDetails$:Observable<any>
  constructor(private _requestService: RequestService) {
    this.loanDetails$ = this._requestService.loanDetails$;
   }

  ngOnInit(): void {
    this.loans$ =   this._requestService.requests$;
this.ctrl.valueChanges.subscribe(c=>{
  this.showConfirmSubject.next(true);
})
  }
confirm(){
  const c = this.ctrl.value;
  this.lastStatusSubject.next(c);
  const indicator = this.loanStatuses.find(l=>l.label==c)?.key;
  this.indicatorSubject.next(indicator);
  this._requestService.updateStatus(this._requestService.selectedIdSubject.value,c)
  setTimeout(()=>this.showConfirmSubject.next(false),0);
}
  selectLoan({id,indicator}:any){
    this._requestService.selectLoan(id);
    this.indicatorSubject.next(indicator);
    this.showSubject.next(true);
    
  this.lastStatusSubject.next(this.ctrl.value);
  }

  closeModal(){
    this.showSubject.next(false);
  }

  closeConfirmModal(){
    this.ctrl.patchValue(this.lastStatusSubject.value);
    setTimeout(()=>this.showConfirmSubject.next(false),0);
  }
}
