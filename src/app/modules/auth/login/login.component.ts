
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from 'src/shared/services/auth/auth.service';
import { UserCategory } from 'src/shared/constants/enum';
import { SocialAuthService, GoogleLoginProvider,FacebookLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    socialUser: SocialUser;
    isLoggedin: boolean; 

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthService,
        private socialAuthService: SocialAuthService
    ) { 
        // redirect to home if already logged in
        const user = this.authenticationService.userValue;
        if (this.authenticationService.isLoggedIn()) { 
            if(user.category== UserCategory.admin){
            this.router.navigate(['/admin']);
            }else{
                this.router.navigate(['/my']);
            }
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.socialAuthService.authState.subscribe((user) => {
            this.socialUser = user;
            this.isLoggedin = (user != null);
            if(this.isLoggedin){
                this.login(this.socialUser.id,"password","social",user)
            }else{
                alert("Error logging in")
            }
            console.log(this.socialUser);
          });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
       this.login(this.f.username.value, this.f.password.value,"default",null)
    }
    login(username:string,password:string, type:string, user:any){
        this.authenticationService.login(username, password,type,user)
        .pipe(first())
        .subscribe(
            data => {
                console.log("Logged In ", data)
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.error = error;
                this.loading = false;
            });
    }
    loginWithGoogle(): void {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
      }
      loginWithFacebook(): void {
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
      }
}
