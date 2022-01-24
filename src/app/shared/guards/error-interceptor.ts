import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Utility } from '../helpers/utility.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService, private _utility:Utility ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                window.location.reload()
            }
            let error = err.error.message||err.error.data || err.statusText;
            if (err.status === 404) {
                error = "This service is unavailable at the moment, try again later";
            }
            // console.log("Interceptor",error)
            let ifConnected = window.navigator.onLine;
            if (!ifConnected) {
            error = 'Please connect to the internet';
            }
            return throwError(error);
        }))
    }
}