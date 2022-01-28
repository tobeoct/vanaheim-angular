import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
 messageTypes:any[]= [{ label: "Announcements" }, { label: "Update" }];
  constructor(private _http: HttpClient) { }

  
  notify = ({customerIDs,code,message,type}:any) => {
    return this._http.post<any>(`${environment.apiUrl}/notification/notifyCustomer`, {customerIDs,code,message,type})
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }

}
