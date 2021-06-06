import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
   

  constructor(
    private _http: HttpClient) { 

    }

    customer=()=>{
      return this._http.get<any>(`${environment.apiUrl}/customer`)
      .pipe(map(response => {
          if(response.status==true){return response.response;} return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
    }

    employers=()=>{
      return this._http.get<any>(`${environment.apiUrl}/customer/employers`)
      .pipe(map(response => {
          if(response.status==true){return response.response;} return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
    }

    companies=()=>{
      return this._http.get<any>(`${environment.apiUrl}/customer/companies`)
      .pipe(map(response => {
          if(response.status==true){return response.response;} return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
    }
    nok=()=>{
      return this._http.get<any>(`${environment.apiUrl}/customer/nok`)
      .pipe(map(response => {
          if(response.status==true){return response.response;} return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
    }
    shareholders=(companyID:number)=>{
      return this._http.get<any>(`${environment.apiUrl}/customer/shareholders?companyId=${companyID}`)
      .pipe(map(response => {
          if(response.status==true){return response.response;} return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
    }

    collaterals=()=>{
      return this._http.get<any>(`${environment.apiUrl}/customer/collaterals`)
      .pipe(map(response => {
          if(response.status==true){return response.response;} return null;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
    }
}
