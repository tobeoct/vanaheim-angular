import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../../shared/services/auth/auth.service';
import { from } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(private _authenticationService: AuthService) {
     }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handleAccess(request, next));
      }
     
      private async handleAccess(request: HttpRequest<any>, next: HttpHandler):
          Promise<HttpEvent<any>> {
            let token:any;
            console.log("Interceptor ", request.url)
            const isLoggedIn = this._authenticationService.isLoggedIn()
            let changedRequest = request;
            const isApiUrl = changedRequest.url.startsWith(environment.apiUrl);
            if ( isApiUrl && !changedRequest.url.includes("users/token")) {

                if(isLoggedIn){
                    token = await this._authenticationService.fetchToken();
                }
            
                // HttpHeader object immutable - copy values
                const headerSettings: {[name: string]: string | string[]; } = {};
            
                for (const key of request.headers.keys()) {
                headerSettings[key] = request.headers.getAll(key)||[];
                }
                if (token) {
                headerSettings['Authorization'] = 'Bearer ' + token.response.response;
                }
                headerSettings['Content-Type'] = 'application/json';
                headerSettings['api_key'] = this._authenticationService.getApiKey();
                headerSettings['credentials'] ="include";
                const newHeader = new HttpHeaders(headerSettings);
                changedRequest = request.clone({
                headers: newHeader,
                withCredentials: true
            });
                return next.handle(changedRequest).toPromise();
            }
        return next.handle(request).toPromise();
      }
     
}