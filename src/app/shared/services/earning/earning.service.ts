import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import moment = require('moment');
import { BehaviorSubject, combineLatest, EMPTY, from, Observable, of, timer } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { EarningApplication } from 'src/app/modules/earnings/earnings-application';
import { EarningsStore } from '../../helpers/store';
import { Utility } from '../../helpers/utility.service';
export enum EarningType {
  EndOfTenor = "End Of Tenor",
  Monthly = "Monthly ROI",
  Quarterly = "Quarterly ROI"
}
@Injectable({
  providedIn: 'root'
})
export class EarningService {

  MGT_FEE: number = 5 / 100;
  TAX: number = 10 / 100;
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  show2Subject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show2$: Observable<boolean> = this.show2Subject.asObservable();
  showLoginSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  lastContinueDisplayTime: Date
  lastContinueDisplayCount: number = 0

  apiSuccessSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  apiSuccess$: Observable<string> = this.apiSuccessSubject.asObservable();

  apiErrorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  apiError$: Observable<string> = this.apiErrorSubject.asObservable();


  filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  filter$: Observable<string> = this.filterSubject.asObservable();
  searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  search$: Observable<string> = this.searchSubject.asObservable();
  pagingSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ pageNumber: 1, maxSize: 10 });
  paging$: Observable<any> = this.pagingSubject.asObservable();

  runningEarningSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  runningEarning$: Observable<boolean> = this.runningEarningSubject.asObservable();


  activeEarningSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  interval = environment.production ? 10000 : 30000000000000000;
  constructor(private _http: HttpClient, private _earningsStore: EarningsStore, private _utils: Utility) { }
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
          r = type == EarningType.EndOfTenor ? 18 : type == EarningType.Quarterly ? 16 : 14;
        } else if (amount > 10000000 && amount <= 20000000) {
          r = type == EarningType.EndOfTenor ? 20 : type == EarningType.Quarterly ? 17 : 16;
        }
        break;
      case 6:
        if (amount >= 100000 && amount <= 10000000) {
          r = type == EarningType.EndOfTenor ? 20 : type == EarningType.Quarterly ? 17 : 16;
        } else if (amount > 10000000 && amount <= 20000000) {
          r = type == EarningType.EndOfTenor ? 21 : type == EarningType.Quarterly ? 18 : 17;
        }
        break;
      case 9:
        if (type == EarningType.Quarterly) {
          if (amount >= 100000 && amount <= 10000000) {
            r = 18;
          } else if (amount > 10000000 && amount <= 20000000) {
            r = 19;
          }
        }
        break;
      case 12:
        if (type == EarningType.Quarterly) {
          if (amount >= 100000 && amount <= 10000000) {
            r = 19;
          } else if (amount > 10000000 && amount <= 20000000) {
            r = 20;
          }
        } else {
          if (amount <= 20000000) {
            r = type == EarningType.EndOfTenor ? 22 : 18;
          }
        }


        break;
    }
    return r;


  }


  earningPayoutPlan = (payload: any) => {
    // console.log(payload)
    return this._http.post<any>(`${environment.apiUrl}/earningspayout/plan`, payload)
      .pipe(map(response => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        if (response && response.status == true) {
          return response.response;
        }
        return response;
      }));

  }


  search = (payload: any) => {
    return this._http.post<any>(`${environment.apiUrl}/earnings/search`, { ...payload })
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }

  notifyTopUp = (earningRequestId: number, amount: number) => {
    const url = `${environment.apiUrl}/earnings/notifyTopUp?id=${earningRequestId}&amount=${amount}`;
    return this._http.get<any>(url)
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }
  notifyLiquidate = (earningRequestId: number, amount: number, payoutDate: Date) => {
    const url = `${environment.apiUrl}/earnings/notifyLiquidation?id=${earningRequestId}&amount=${this._utils.convertToPlainNumber(amount)}&payoutDate=${payoutDate}`;
    return this._http.get<any>(url)
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }
  getLatest = () => {
    return timer(0, this.interval)
      .pipe(switchMap(() => this._http.get<any>(`${environment.apiUrl}/earnings/getLatestEarnings`)
        .pipe(map(response => {
          if (response && response.status == true) {
            return Object.keys(response.response).length > 0 ? response.response : null;
          }
          return null;
        }), catchError(err => {
          console.error(err);
          this.runningEarningSubject.next(false)
          return EMPTY;
        }))),
        // shareReplay({bufferSize:1, refCount:true})
        catchError(err => {
          console.error(err);
          this.runningEarningSubject.next(false)
          return EMPTY;
        })
      )
  }

  // timer$:Observable<any> = timer(0, 1000);

  earnings$: Observable<any> = this.search({ pageNumber: 1, maxSize: 10 });
  latestEarnings$: Observable<any[]> = this.getLatest().pipe(tap(earnings => {
    if (earnings) {
      if (earnings.some(c => !c || c.requestStatus == "NotQualified" || c.requestStatus == "Closed")) { this.runningEarningSubject.next(false) } else {
        this.runningEarningSubject.next(true)
      }
    }
  }
  ));//combineLatest([this.getLatest(),this.timer$]).pipe(map(([earnings,timer])=>earnings),shareReplay(1));
  earningWithFilter$ = combineLatest([
    this.earnings$,
    this.filter$,
    this.search$,
    this.paging$
  ])
    .pipe(mergeMap(([earnings, filter, search, paging]) => this.search({ ...paging, status: filter, search })),
      map(value => value),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    );

  filteredEarnings$ = this.earningWithFilter$
    .pipe(
      filter(filteredEarning => Boolean(filteredEarning)),
      switchMap((earnings: any) =>
        from(earnings.rows)
          .pipe(
            mergeMap(earnings => this.search({ pageNumber: 1, maxSize: 10 })),
          )
      )
    );

  getNextDueDate(dateFunded: any, tenure: number, denominator: string) {
    let funded = moment(dateFunded);
    let now = moment();
    let d: any = denominator == "Months" ? "months" : "days";
    let maturityDate = funded.add(tenure, d);
    let diff = now.diff(funded, d);
    let nextMonth = funded.add(diff, d);
    return nextMonth < maturityDate ? nextMonth : maturityDate;
  }
  getNextDueDateFormatted(dateFunded: any, tenure: number, denominator: string) {
    return this.getNextDueDate(dateFunded, tenure, denominator).format("MMMM Do YYYY");
  }
  getDaysLeft(dateFunded: any, tenure: number, denominator: string) {
    let d = this.getNextDueDate(dateFunded, tenure, denominator);
    let now = moment();
    return d.diff(now, "days");
  }

  validateApplication() {
    const application = this._earningsStore.earningsApplication as EarningApplication;
    if (application.accountInfo && application.earningsCalculator && application.meansOfIdentification && application.nokInfo && application.personalInfo) return true;
    return false;
  }
  continueApplication(value: boolean) {
    if (this.lastContinueDisplayTime && moment().diff(moment(this.lastContinueDisplayTime), "minute") < 5 && this.lastContinueDisplayCount > 1) {
      this.activeEarningSubject.next(false);
      return;
    }
    if (!value) {
      this.lastContinueDisplayCount += 1;
    }
    this.activeEarningSubject.next(value);
  }
}
