import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, interval, Observable, of, Subscription, throwError, timer } from 'rxjs';
import { catchError, debounceTime, map, timeout } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/interfaces/user';
import * as moment from 'moment';
import { LoginType } from '@models/helpers/enums/logintype';
import { Utility } from 'src/app/shared/helpers/utility.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    private timeoutSubscription: Subscription;
    public isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public get userValue(): User {
        return this.userSubject.value;
    }
    sessionTimeout$ = timer(0, 5000);

    constructor(
        private _router: Router,
        private _http: HttpClient,
        private _utility: Utility
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') || '{}'));
        this.user = this.userSubject.asObservable();

        this.timeoutSubscription = this.sessionTimeout$
            .subscribe(c => {
                let expirationDate = this.getExpiration();
                // console.log("Checking Session",expirationDate?.toDate());
                if (expirationDate && moment().isAfter(expirationDate)) {
                    this.isLoggedInSubject.next(false);
                    this.logout();
                } else {
                    if (this.isLoggedIn()) this.isLoggedInSubject.next(true);
                }
            })
    }



    login({ username, password, type, socialUser, loginAs }: any) {
        return this._http.post<any>(`${environment.apiUrl}/auth/login`, { username, password, type, socialUser, browserID: this._utility.$browserID, loginAs })
            .pipe(map(response => {
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                if (response && response.status == true) {
                    const user = this.createSession(response.response, response.response["expires-in"]);
                    this.userSubject.next(user);
                    return user;
                }
                return null;
            }));
    }
    register = ({ email, password, type, socialUser, phoneNumber, firstName, lastName }: any) => {
        return this._http.post<any>(`${environment.apiUrl}/auth/register`, { email, password, socialUser, type, phoneNumber, firstName, lastName, browserID: this._utility.$browserID })
            .pipe(map(response => {
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                if (response && response.status == true && type == LoginType.Social) {
                    const user = this.createSession(response.response, response.response["expires-in"]);
                    this.userSubject.next(user);
                    return user;
                }
                return response;
            }));
    }

    createSession = (obj: any, expiresIn: any, isSocial: boolean = false, authToken: string = ""): User => {
        let user: User = new User();
        let { lastName, firstName, username, id, category, type } = obj;
        user.username = username
        user.lastName = lastName;
        user.firstName = firstName;
        user.id = id;
        user.category = category;
        user.type = type;
        this.setSession({ expiresIn: expiresIn, user: user })

        return user;
    }

    verify = ({ username }: any) => {
        // console.log(username)
        return this._http.post<any>(`${environment.apiUrl}/auth/verify`, { username })
            .pipe(map(response => {
                if (response && response.status == true) {
                    // console.log(response);
                    return response.response;
                }
                return null;
            }));
    }
    resetPassword = ({ username }: any) => {
        // console.log(username)
        return this._http.post<any>(`${environment.apiUrl}/auth/resetpassword`, { username })
            .pipe(map(response => {
                if (response && response.status == true) {
                    // console.log(response);
                    return response.response;
                }
                return null;
            }));
    }
    stay = () => {
        // console.log(username)
        return of([])
        return this._http.get<any>(`${environment.apiUrl}/auth/refresh-session`)
            .pipe(map(response => {
                if (response && response.status == true) {
                    // console.log(response);
                    return response.response;
                }
                return null;
            }));
    }
    changePassword = ({ oldPassword,newPassword }: any) => {
        return this._http.put<any>(`${environment.apiUrl}/auth/passwordChange`, { oldPassword,newPassword })
            .pipe(map(response => {
                if (response && response.status == true) {
                     return response.response;
                }
                return null;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        // localStorage.clear();

        localStorage.removeItem('user');
        localStorage.removeItem('session_token');
        localStorage.removeItem("expires_at");
        // localStorage.removeItem("page");
        localStorage.removeItem("previous");
        // localStorage.removeItem("loan-application");
        this.userSubject.next(new User());
        this.isLoggedInSubject.next(false);
        this.timeoutSubscription.unsubscribe();
        if (this._router.url.includes("admin")) { this._router.navigate(['admin/auth/login']); } else { this._router.navigate(['/login']); }
        return this._http.get<any>(`${environment.apiUrl}/auth/logout`)
            .pipe(map(() => {
            }), catchError((err: any) => {
                return EMPTY;
            }))
    }

    private setSession({ expiresIn, user }: any) {
        // console.log("Setting Session", expiresIn)
        const expiresAt = moment().add(expiresIn * 0.001, 'second');

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
        //   setTimeout(()=>{console.log("Logging Out");this.logout()}, +expiresIn*1000)
    }
    public isLoggedIn() {
        const expiry = this.getExpiration();
        let value = expiry ? moment().isBefore(this.getExpiration()) : false; //&& this.getSessionToken();
        this.isLoggedInSubject.next(value);
        return value;
    }

    fetchToken = () => {
        return fetch(`${environment.apiUrl}/auth/token`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', "api_key": "109835" },
            credentials: "include"
        }).then(response => response.json()).catch(console.log)

    };
    private getSessionToken = () => {

        return localStorage.getItem("session_token");
    }

    getApiKey = () => {
        return '1234567890';
    }

    getExpiration() {
        if (!localStorage.getItem("expires_at")) return undefined;
        const expiration: string = localStorage.getItem("expires_at") || '{}';
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }
}
