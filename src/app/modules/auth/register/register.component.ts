import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCategory } from '@models/helpers/enums/usercategory';
import { SocialUser, SocialAuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { Subject, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import  {VCValidators}  from 'src/app/shared/validators/default.validators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoginType } from '@models/helpers/enums/logintype';
import { Store } from 'src/app/shared/helpers/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  returnUrl: string;
  socialUser: SocialUser;
  isLoggedin: boolean; 
  redirectEmail:string;
  allSubscriptions:Subscription[]=[];
  get email(){
    return this.form.get("email") as FormControl|| new FormControl();
  }
  get phone(){
    return this.form.get("phone")as FormControl || new FormControl();
  }
  get firstName(){
    return this.form.get("firstName")as FormControl|| new FormControl();
  }
  get lastName(){
    return this.form.get("lastName")as FormControl|| new FormControl();
  }
  get password(){
    return this.form.get("passwordGroup.password")as FormControl|| new FormControl();
  }
  get confirmPassword(){
    return this.form.get("passwordGroup.confirmPassword")as FormControl|| new FormControl();
  }
  get passwordGroup(){
    return this.form.get("passwordGroup")as FormGroup|| new FormControl();
  }
  get channel(){
    return this.form.get("channel")as FormControl|| new FormControl();
  }
  
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();

  apiErrorSubject:Subject<string> = new Subject<string>(); 
    apiError$:Observable<string> = this.apiErrorSubject.asObservable();
    apiSuccessSubject:Subject<string> = new Subject<string>(); 
    apiSuccess$:Observable<string> = this.apiSuccessSubject.asObservable();
    loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
    loading$:Observable<boolean> = this.loadingSubject.asObservable();
    
  constructor(
      private _fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthService,
      private socialAuthService: SocialAuthService,
      private _router:Router,
      private _validators:VCValidators,
      private _store:Store
  ) { 
      // redirect to home if already logged in
      const user = this.authenticationService.userValue;
      if (this.authenticationService.isLoggedIn()) { 
          if(user.category== UserCategory.Staff){
          this.router.navigate(['/admin']);
          }else{
              this.router.navigate(['/my']);
          }
      }
  }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(sub=>sub.unsubscribe());
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.redirectEmail = params['email'];
    });
    const {firstName,surname,email,phoneNumber}:any = this._store.registerDetails;
      this.form = this._fb.group({
        firstName: [firstName?firstName:'',[Validators.required,Validators.minLength(3)]],
        lastName: [surname?surname:'',[Validators.required,Validators.maxLength(50)]],
        passwordGroup: this._fb.group({
          password: ['', [Validators.required, this._validators.password]],
          confirmPassword: ['', [Validators.required, this._validators.password]]},
          {validator:this._validators.matcher("password","confirmPassword")}),
        phone:[phoneNumber?phoneNumber:'', [Validators.required, this._validators.phone]],
        email:[email?email:this.redirectEmail?this.redirectEmail:'', [Validators.email,Validators.required]],
        channel: []
      });
      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      const sub = this.socialAuthService.authState.subscribe((user) => {
          this.socialUser = user;
          this.isLoggedin = (user != null);
          console.log(this.socialUser);
          if(this.isLoggedin){
              this.register({type:LoginType.Social, socialUser:user});
          }else{
              alert("Error logging in")
          }
        });
        this.allSubscriptions.push(sub);
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(form:FormGroup) {
      
      // stop here if form is invalid
      if (form.invalid) {
          return;
      }

      this.loadingSubject.next(true);
     this.register({email:this.email.value,password:this.password.value,firstName:this.firstName.value,lastName:this.lastName.value,phoneNumber:this.phone.value,type:LoginType.Default})
  }
  register({email,password,firstName,lastName,phoneNumber,type,socialUser}:any){
      this.authenticationService.register({email,password,firstName,lastName,phoneNumber,type,socialUser})
      .pipe(first())
      .subscribe(
          data => {
              console.log("Registered ", data)
              this.apiSuccessSubject.next("Registration was successful");
              if(this.isLoggedin){
                setTimeout(()=> this.onNavigate(this.returnUrl),2000);
              }
              setTimeout(()=> this.onNavigate("/auth/login",{username:email}),2000);
          },
          error => {
              // this.error = error;
              //let err = "Small wahala dey with connectivity, abeg retry"
              setTimeout(()=>{this.apiErrorSubject.next("Error: "+error);this.loadingSubject.next(false);},1000)
          setTimeout(()=>{this.apiErrorSubject.next();},5000)
            
          });
  }
  loginWithGoogle(): void {
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }
    loginWithFacebook(): void {
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    onNavigate(route:string,params:any={}):void{
      this._router.navigate([route],{queryParams: params})
    }
    onError(value:any):void{
      // console.log(value);
      this.errorMessageSubject.next(value);
    }
   
    
}
