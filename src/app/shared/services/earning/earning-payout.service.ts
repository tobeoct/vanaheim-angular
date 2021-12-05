import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, map, mergeMap, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EarningPayoutService {
  selectedApprovedIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedApprovedId$: Observable<number> = this.selectedApprovedIdSubject.asObservable();
  repayments$: Observable<any>
  myEarningPayouts$: Observable<any>
  constructor(private _http: HttpClient) {
    this.repayments$ = this.selectedApprovedId$.pipe(mergeMap((id) => this.getEarningPayoutHealth(id)), shareReplay(1),
      map(value => value),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    );
    this.myEarningPayouts$ = this.selectedApprovedId$.pipe(mergeMap((id) => this.getEarningPayout(id)), shareReplay(1),
      map(value => value),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    );
  }
  selectEarning(id: number) {
    this.selectedApprovedIdSubject.next(id);
  }

  getEarningPayout = (approvedEarningID: number) => {
    const url = `${environment.apiUrl}/earningspayout/getEarningPayouts?approvedEarningID=${approvedEarningID}`;
    return this._http.get<any>(url)
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return [];
      }));
  }
  pay = (approvedEarningId: number, earningRequestId: number, amount: number) => {
    const url = `${environment.apiUrl}/earningspayout/pay`;
    return this._http.post<any>(url, { approvedEarningId, earningRequestId, amount })
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }
  getEarningPayoutHealth = (approvedEarningID: number) => {
    const url = `${environment.apiUrl}/earningspayout/getEarningPayoutHealth?approvedEarningID=${approvedEarningID}`;
    return this._http.get<any>(url)
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return [];
      }));
  }
}
