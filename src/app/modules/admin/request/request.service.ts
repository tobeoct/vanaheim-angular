import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import moment = require('moment');
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService  {

  constructor(private _http: HttpClient) { }
  searchForAdmin=(payload:any)=>{
    return this._http.post<any>(`${environment.apiUrl}/loans/searchToProcess`, {...payload})
    .pipe(map(response => {
        if(response && response.status==true){
           return response.response;
        }
        return {};
    }));
  }
  updateStatus=(id:number,status:string)=>{
    return this._http.post<any>(`${environment.apiUrl}/loans/updateStatus`, {id,status})
    .pipe(map(response => {
        if(response && response.status==true){
           return response.response;
        }
        return {};
    })).toPromise();
  }
  loansForAdmin$:Observable<any>= this.searchForAdmin({pageNumber:1,maxSize:100});//,from:moment().startOf("day").add(1,"day"),to:moment()});
  getCustomer=(id:any)=>{
    return this._http.get<any>(`${environment.apiUrl}/customer/getById?id=${id}`)
    .pipe(map(response => {
        if(response && response.status==true){
           return response.response;
        }
        return {};
    }), distinctUntilChanged()).toPromise();
  }

}
