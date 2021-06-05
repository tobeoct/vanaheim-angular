import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  constructor(private _http:HttpClient) { }
  apply=(payload:any)=>{
    // console.log(payload)
    return this._http.post<any>(`${environment.apiUrl}/investments/apply`, payload)
    .pipe(map(response => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        if(response && response.status==true){
           return response.response;
        }
        return response;
    }));

}
}
