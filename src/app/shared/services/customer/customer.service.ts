import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NOKInfo } from 'src/app/modules/loan/personal/nok-info/nok-info';
import { PersonalInfo } from 'src/app/modules/loan/personal/personal-info/personal-info';
import { AccountInfo } from 'src/app/modules/loan/shared/account-info/account-info';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  constructor(
    private _http: HttpClient) {

  }

  customer = () => {
    return this._http.get<any>(`${environment.apiUrl}/customer`)
      .pipe(map(response => {
        if (response.status == true && Object.keys(response.response).length > 0) { return response.response; } return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }
  

  customers = () => {
    return this._http.get<any>(`${environment.apiUrl}/customer/all`)
      .pipe(map(response => {
        if (response.status == true && Object.keys(response.response).length > 0) { return response.response; } return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }

  employers = () => {
    return this._http.get<any>(`${environment.apiUrl}/customer/employers`)
      .pipe(map(response => {
        if (response.status == true && Object.keys(response.response).length > 0) { return response.response; } return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }

  companies = () => {
    return this._http.get<any>(`${environment.apiUrl}/customer/companies`)
      .pipe(map(response => {
        if (response.status == true && Object.keys(response.response).length > 0) { return response.response; } return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }
  nok = () => {
    return this._http.get<any>(`${environment.apiUrl}/customer/nok`)
      .pipe(map(response => {
        if (response.status == true && Object.keys(response.response).length > 0) { return response.response; } return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }
  shareholders = (companyID: number) => {
    return this._http.post<any>(`${environment.apiUrl}/customer/shareholders`, { companyID })
      .pipe(map(response => {
        if (response.status == true && Object.keys(response.response).length > 0) { return response.response; } return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }

  collaterals = () => {
    return this._http.get<any>(`${environment.apiUrl}/customer/collaterals`)
      .pipe(map(response => {
        if (response.status == true && Object.keys(response.response).length > 0) { return response.response; } return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }

  getBVN = () => {
    return this._http.get<any>(`${environment.apiUrl}/customer/bvn`)
      .pipe(map(response => {
        if (response.status == true) { return response.response; } else return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }
  updateCustomer = (personalInfo: PersonalInfo) => {
    return this._http.put<any>(`${environment.apiUrl}/customer/update`, personalInfo)
      .pipe(map(response => {
        if (response.status == true) { return response.response; } else return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }
  updateNOK = (nokInfo: NOKInfo) => {
    return this._http.put<any>(`${environment.apiUrl}/customer/updateNOK`, nokInfo)
      .pipe(map(response => {
        if (response.status == true) { return response.response; } else return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }
  updateAccounts = (accountInfos: AccountInfo[]) => {
    return this._http.post<any>(`${environment.apiUrl}/account/updateAccounts`, {accounts:accountInfos})
      .pipe(map(response => {
        if (response.status == true) { return response.response; } else return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }
}
