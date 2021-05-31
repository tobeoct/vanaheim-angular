import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Utility } from '../../helpers/utility.service';
// import { LoanResponse } from '../../poco/loan/loan-response';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
   

  constructor(
    private _http: HttpClient,
    private _utility:Utility) { 

    }
    
    validateBVN=(payload:string)=>{
      return this._http.post<any>(`${environment.apiUrl}/common/validatebvn`, {payload})
      .pipe(map(response => {
         
          return response.status;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
    }

    accountEnquiry=(payload:any)=>{
      return this._http.post<any>(`${environment.apiUrl}/account/enquiry`, {...payload})
      .pipe(map(response => {
          return response;
      }), catchError(err => {
        console.error(err);
        return throwError(err);
      }));
    }

}
