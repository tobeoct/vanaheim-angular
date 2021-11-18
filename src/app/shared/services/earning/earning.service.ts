import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export enum EarningType {
  EndOfTenor = "End Of Tenor",
  Monthly = "Monthly ROI"
}
@Injectable({
  providedIn: 'root'
})
export class EarningService {

  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  show2Subject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show2$: Observable<boolean> = this.show2Subject.asObservable();
  showLoginSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  apiSuccessSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  apiSuccess$: Observable<string> = this.apiSuccessSubject.asObservable();

  apiErrorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  apiError$: Observable<string> = this.apiErrorSubject.asObservable();
  constructor(private _http: HttpClient) { }
  apply = (payload: any) => {
    // console.log(payload)
    return this._http.post<any>(`${environment.apiUrl}/earnings/apply`, payload)
      .pipe(map(response => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        if (response && response.status == true) {
          return response.response;
        }
        return response;
      }));


  }
  showSuccess(v: boolean) {
    this.showSubject.next(v);
  }
  showError(v: boolean) {
    this.show2Subject.next(v);
  }
  showLogin = (value: boolean) => {
    this.showLoginSubject.next(value);
  }
  success(v: string) {
    this.apiSuccessSubject.next(v);
  }
  error(v: string) {
    this.apiErrorSubject.next(v);
  }
  getRate(type: EarningType, amount: number, duration: number) {
    let r = 0;

    switch (duration) {
      case 3:
        if (amount >= 100000 && amount <= 10000000) {
          r = type == EarningType.EndOfTenor ? 18 : 16;
        } else if (amount > 10000000 && amount <= 20000000) {
          r = type == EarningType.EndOfTenor ? 20 : 18;
        }
        break;
      case 6:
        if (amount >= 100000 && amount <= 10000000) {
          r = type == EarningType.EndOfTenor ? 20 : 18;
        } else if (amount > 10000000 && amount <= 20000000) {
          r = type == EarningType.EndOfTenor ? 22 : 20;
        }
        break;

      case 12:
        if (amount <= 20000000) {
          r = type == EarningType.EndOfTenor ? 22 : 20;
        }
        break;
    }
    return r;


  }
}
