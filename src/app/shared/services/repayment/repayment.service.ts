import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, map, mergeMap, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RepaymentService {
  selectedDisbIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedDisbId$: Observable<number> = this.selectedDisbIdSubject.asObservable();
  repayments$: Observable<any>
  myRepayments$: Observable<any>
  constructor(private _http: HttpClient) {
    this.repayments$ = this.selectedDisbId$.pipe(mergeMap((id) => this.getRepaymentHealth(id)), shareReplay(1), tap(console.log),
      map(value => value),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    );
    this.myRepayments$ = this.selectedDisbId$.pipe(mergeMap((id) => this.getRepayment(id)), shareReplay(1), tap(console.log),
      map(value => value),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    );
  }
  selectLoan(id: number) {
    this.selectedDisbIdSubject.next(id);
  }

  getRepayment = (disbursedLoanID: number) => {
    const url = `${environment.apiUrl}/repayment/getRepayments?disbursedLoanID=${disbursedLoanID}`;
    return this._http.get<any>(url)
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return [];
      }));
  }
  repay = (disbursedLoanId: number, loanRequestId: number, amount: number) => {
    const url = `${environment.apiUrl}/repayment/repay`;
    return this._http.post<any>(url, { disbursedLoanId, loanRequestId, amount })
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }
  getRepaymentHealth = (disbursedLoanID: number) => {
    const url = `${environment.apiUrl}/repayment/getRepaymentHealth?disbursedLoanID=${disbursedLoanID}`;
    return this._http.get<any>(url)
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return [];
      }));
  }
}
