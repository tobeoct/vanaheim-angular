import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private _http: HttpClient) { }

  
  fetchUsers= ()  => {
  return  this._http.get<any>(`${environment.apiUrl}/users`)
  
        
    };

}
