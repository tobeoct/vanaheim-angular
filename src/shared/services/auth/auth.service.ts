import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from 'src/shared/interfaces/user';
import * as moment from 'moment';
import { SocialUser } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private _router: Router,
        private _http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')|| '{}'));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username: string, password: string, type:string, socialUser: any) {
        return this._http.post<any>(`${environment.apiUrl}/auth/login`, { username, password,type,socialUser })
            .pipe(map(response => {
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                console.log("Login",response)
                if(response && response.status==true){
                    let user:User = new User();
                    let {lastName,firstName,username,id, category} = response.response;
                    user.username = username
                    user.lastName=lastName;
                    user.firstName = firstName;
                    user.id = id;
                    user.category = category;
                    // user.authdata =response.response["session-token"];
                     //window.btoa(username + ':' + password);
                    this.setSession({expiresIn: response.response["expires-in"],user: user })
                    this.userSubject.next(user);
                    return user;
                }
                return null;
            }));
    }

    logout() {
        // remove user from local storage to log user out
       return this._http.get<any>(`${environment.apiUrl}/auth/logout`)
            .pipe(map(response => {
        localStorage.removeItem('user');
        localStorage.removeItem('session_token');
        localStorage.removeItem("expires_at");
        this.userSubject.next(new User());
        this._router.navigate(['/login']);
            }))
    }

    private setSession({expiresIn,user}:any) {
        console.log("Setting Session", expiresIn)
      const expiresAt = moment().add(expiresIn,'second');

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
      setTimeout(()=>{console.log("Logging Out");this.logout()}, +expiresIn*1000)
  }
  public isLoggedIn() {
      const expiry =  this.getExpiration();
    return expiry?  moment().isBefore(this.getExpiration()):false; //&& this.getSessionToken();
    return Object.keys(this.userValue).length>0 //&& this.userValue.authdata
}

 fetchToken= ()  => {
  return fetch(`${environment.apiUrl}/auth/token`, {
        method: 'POST',
        headers: { 'content-type': 'application/json',"api_key":"109835" },
        credentials: "include"
    }).then(response=>response.json()).catch(console.log)
        
    };
getSessionToken=()=>{
    
   return localStorage.getItem("session_token");
}

getApiKey=()=>{
    return '1234567890';
}

getExpiration() {
    if(!localStorage.getItem("expires_at")) return undefined;
    const expiration:string = localStorage.getItem("expires_at")|| '{}';
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
}       
}
