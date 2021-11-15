import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  showSubject:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  show$:Observable<boolean> = this.showSubject.asObservable();
  show2Subject:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  show2$:Observable<boolean> = this.show2Subject.asObservable();

  
apiSuccessSubject:BehaviorSubject<string> = new BehaviorSubject<string>(''); 
apiSuccess$:Observable<string> = this.apiSuccessSubject.asObservable();

apiErrorSubject:BehaviorSubject<string> = new BehaviorSubject<string>(''); 
apiError$:Observable<string> = this.apiErrorSubject.asObservable();
  constructor(private _http:HttpClient) { }
  apply=(payload:any)=>{
    // console.log(payload)
    return this._http.post<any>(`${environment.apiUrl}/earnings/apply`, payload)
    .pipe(map(response => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        if(response && response.status==true){
           return response.response;
        }
        return response;
    }));

   
}
show(v:boolean){
     this.showSubject.next(v);
}
show2(v:boolean){
  this.show2Subject.next(v);
}
success(v:string){
     this.apiSuccessSubject.next(v);
}
error(v:string){
  this.apiErrorSubject.next(v);
}
}
