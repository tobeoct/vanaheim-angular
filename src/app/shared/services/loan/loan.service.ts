import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import moment = require('moment');
import { BehaviorSubject, combineLatest, EMPTY, from, Observable, timer } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, retry, shareReplay, switchMap, take, tap, toArray } from 'rxjs/operators';
import { LoanStore, Store } from '../../helpers/store';
import { Utility } from '../../helpers/utility.service';
import { LoanResponse } from '../../poco/loan/loan-response';
// import { LoanResponse } from '../../poco/loan/loan-response';
const POLLING_INTERVAL = 30000;
@Injectable({
  providedIn: 'root'
})
export class LoanService {
  loanPurpose: any = {
    business: ["Expand my business", "Increase my inventory", "Recruit and hire new talented employees", "Improve my business’s cash flow", " Move my business to a new location", "Improve and expand my marketing strategy", "Overcome upaid invoices", "Take On a new contract", "Update and upgrade my business equipment", "‘Other’: Get a loan for any business reason"],
    //personal:["Fees Payment","Bills Payment","Others"],
    personal: ["Bill Payments", "Investment opportunity", "Business Opportunity", "LPO financing", "Education Funding", "Salary/Cash Advance", "Repairs and Maintenance", "Emergency Expenses", "Bulk Purchase", "Others"],
    lpo: ["Finance Supply orders", "Take on a new Supply Contract", "Mobilize for a service contract", "Stock Inventory"]
  }

  filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  filter$: Observable<string> = this.filterSubject.asObservable();
  searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  search$: Observable<string> = this.searchSubject.asObservable();
  pagingSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ pageNumber: 1, maxSize: 10 });
  paging$: Observable<any> = this.pagingSubject.asObservable();

  runningLoanSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  runningLoan$: Observable<boolean> = this.runningLoanSubject.asObservable();


  activeLoanSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  interval = environment.production ? POLLING_INTERVAL : 30000000000000000;
  constructor(
    private _http: HttpClient,
    private _utils: Utility,
    private _store: Store,
    private _loanStore:LoanStore) {

  }
  continueApplication(value:boolean){
    this.activeLoanSubject.next(value);
  }
  getTenureRange = (type: string) => {
    if (type.toLowerCase().includes("float")) {
      return { min: 1, max: 30 };
    }
    return { min: 1, max: 12 };
  }
  getRate = (type: string, loanAmount: number, min: number, max: number) => {
    let interestRate = 0;
    if (type.toLowerCase().includes('float me')) {
      if (loanAmount >= min && loanAmount < 100000) {
        interestRate = 0.005;
      }
      else if (loanAmount >= 100000 && loanAmount < 200000) {
        interestRate = 0.0045;
      }
      else if (loanAmount >= 200000 && loanAmount < 1000000) {
        interestRate = 0.004;
      }
      else if (loanAmount >= 1000000 && loanAmount <= max) {
        interestRate = 0.0033;
      } else {
        // alert("Loan Amount must be between the range specified");
        interestRate = 0;
      }
      return interestRate;
    }
    else {
      if (loanAmount >= min && loanAmount < 100000) {
        interestRate = 0.1;
      }
      else if (loanAmount >= 100000 && loanAmount < 200000) {
        interestRate = 0.07;
      } else if (loanAmount >= 200000 && loanAmount < 1000000) {
        interestRate = 0.065;
      }
      else if (loanAmount >= 1000000 && loanAmount <= max) {
        interestRate = 0.06;
      } else {
        interestRate = 0;
      }
      return interestRate;
    }
  }
  getLoanPurposes = (loanType: string) => {
    if (loanType.toLowerCase().includes("lpo")) return this.loanPurpose.lpo;
    if (loanType.toLowerCase().includes("business")) return this.loanPurpose.business;
    return this.loanPurpose.personal;
  }
  getDenominator = (tenure: number, loanType: string) => {
    if (loanType.toLowerCase().includes("float")) {
      return tenure > 1 ? "Days" : "Day";
    }
    return tenure > 1 ? "Mos" : "Mo";
  }
  calculateMonthlyRepayment = (loanAmount: any, tenure: any, loanType: any) => {
    // loanAmount = this._utility.convertToPlainNumber(loanAmount)
    let minMax: any = this.getMinMax(loanType);
    let max = +minMax["max"];
    let min = +minMax["min"];
    let interestRate: number = 0;
    switch (loanType.toLowerCase()) {
      case "Float Me - Business":
        interestRate = this.getRate("float me", loanAmount, min, max);
        break;
      default: interestRate = this.getRate(loanType, loanAmount, min, max); break;
      // $monthlyHeader.textContent = "Monthly Payment (NGN)";

    }
    const P = loanAmount;
    const i = interestRate;
    const n = tenure;
    const monthlyPay = (P * i * ((1 + i) ** n)) / (((1 + i) ** n) - 1);
    return monthlyPay;
    // this._utility.currencyFormatter(monthlyPay);
  }
  getMinMax = (loanType: any) => {
    switch (loanType.toLowerCase()) {
      case "business loans":
        return { min: 50000, max: 10000000, minString: "50K", maxString: "10M", tenure: "monthly" };
      case "personal loans":
        return { min: 25000, max: 5000000, minString: "25K", maxString: "5M", tenure: "monthly" };
      case "lpo financing":
        return { min: 50000, max: 10000000, minString: "50K", maxString: "10M", tenure: "monthly" };
      case "float me - business":
        return { min: 100000, max: 5000000, minString: "100K", maxString: "5M", tenure: "daily" };
      case "float me - personal":
        return { min: 25000, max: 1000000, minString: "25K", maxString: "1M", tenure: "daily" };
      default:
        return { min: 25000, max: 5000000, minString: "25K", maxString: "5M", tenure: "monthly" };
    }
  }
  getTotalRepayment = (monthlyRepayment: number, tenure: number) => {
    return monthlyRepayment * tenure;
  }
  validateLoanApplication() {
    let application = this._loanStore.loanApplication;
    let category = this._loanStore.loanCategory;
    if (application && category) {
      application = application[category];
      if (!application) return false;
      if (!application["loanType"] || !application["loanProduct"] || !application["applyingAs"] || !application["accountInfo"] || !application["loanCalculator"]) return false;
      if (category == 'personal' && (!application["bvn"] || !application["personalInfo"] || !application["employmentInfo"] || !application["nokInfo"])) return false;
      if (category == 'business' && (!application["collateralInfo"] || !application["companyInfo"] || !application["shareholderInfo"])) return false;
      return true;
    }
    return false;
  }
  apply = (payload: LoanResponse) => {
    // console.log(payload)
    return this._http.post<any>(`${environment.apiUrl}/loans/create`, payload)
      .pipe(map(response => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        if (response && response.status == true) {
          return response.response;
        }
        return response;
      }));

  }

  repaymentPlan = (payload: any) => {
    // console.log(payload)
    return this._http.post<any>(`${environment.apiUrl}/repayment/plan`, payload)
      .pipe(map(response => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        if (response && response.status == true) {
          return response.response;
        }
        return response;
      }));

  }


  search = (payload: any) => {
    return this._http.post<any>(`${environment.apiUrl}/loans/search`, { ...payload })
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }

  
  getLatest = () => {
    return timer(0, this.interval)
      .pipe(switchMap(() => this._http.get<any>(`${environment.apiUrl}/loans/getLatestLoan`)
        .pipe(map(response => {
          if (response && response.status == true) {
            return Object.keys(response.response).length > 0 ? response.response : null;
          }
          return null;
        }), catchError(err => {
          console.error(err);
          this.runningLoanSubject.next(false)
          return EMPTY;
        }))),
        // shareReplay({bufferSize:1, refCount:true})
         catchError(err => {
          console.error(err);
          this.runningLoanSubject.next(false)
          return EMPTY;
        })
      )
  }

  // timer$:Observable<any> = timer(0, 1000);

  loans$: Observable<any> = this.search({ pageNumber: 1, maxSize: 10 });
  latestLoan$: Observable<any> = this.getLatest().pipe(tap(c => {
    if (!c || c.requestStatus == "NotQualified" || c.requestStatus == "Completed") { this.runningLoanSubject.next(false) } else {
      this.runningLoanSubject.next(true)
    }
  }
  ));//combineLatest([this.getLatest(),this.timer$]).pipe(map(([loans,timer])=>loans),shareReplay(1));
  loanWithFilter$ = combineLatest([
    this.loans$,
    this.filter$,
    this.search$,
    this.paging$
  ])
    .pipe(mergeMap(([loans, filter, search, paging]) => this.search({ ...paging, status: filter, search })),
      map(value => value),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    );

  filteredLoans$ = this.loanWithFilter$
    .pipe(
      filter(filteredLoan => Boolean(filteredLoan)),
      switchMap((loans: any) =>
        from(loans.rows)
          .pipe(
            mergeMap(loans => this.search({ pageNumber: 1, maxSize: 10 })),
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
}
