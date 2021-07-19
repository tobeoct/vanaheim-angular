import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, mergeMap, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisbursedLoanService {

  selectedLoanIdSubject:BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedLoanId$:Observable<number> = this.selectedLoanIdSubject.asObservable();
  
  disbursedLoanDetail$: Observable<any>
  constructor(private _http:HttpClient) { 
    this.disbursedLoanDetail$ = this.selectedLoanId$.pipe(mergeMap((id) =>this.getDisbursedLoan(id)),shareReplay(1),tap(console.log),
    map(value=>value), 
    catchError(err => {
        console.error(err);
        return EMPTY;
      })
      );
  }
  selectLoan(id:number){
    this.selectedLoanIdSubject.next(id);
  }

  getDisbursedLoan=(loanRequestID:number)=>{
    const url = `${environment.apiUrl}/loans/getDisbursedLoan?requestID=${loanRequestID}`;
    return this._http.get<any>(url)
    .pipe(map(response => {
        if(response && response.status==true){
           return response.response;
        }
        return {};
    }));
  }
}
