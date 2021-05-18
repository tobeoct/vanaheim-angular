import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginType } from '@models/helpers/enums/logintype';
import { UserCategory } from '@models/helpers/enums/usercategory';
import {VCValidators} from 'src/app/shared/validators/default.validators';
import { BehaviorSubject, Observable, from, Subject, Subscription } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit , OnDestroy {
  form: FormGroup;
  returnUrl: string;
  isLoggedin: boolean;
  returnUsername:string; 
allSubscriptions:Subscription[]=[];

    get username(){
      return this.form.get("username") as FormControl|| new FormControl();
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    focusSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
    focus$:Observable<boolean> = this.focusSubject.asObservable();
    delay$ = from([1]).pipe(delay(3000));
  errorMessageSubject:Subject<any> = new Subject<any>(); 
  errorMessage$:Observable<any> = this.errorMessageSubject.asObservable();

  apiSuccessSubject:Subject<string> = new Subject<string>(); 
  apiSuccess$:Observable<string> = this.apiSuccessSubject.asObservable();

  apiErrorSubject:Subject<string> = new Subject<string>(); 
  apiError$:Observable<string> = this.apiErrorSubject.asObservable();
  
loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
loading$:Observable<boolean> = this.loadingSubject.asObservable();
  constructor(
      private _fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthService,
      private _router:Router,
      private _validators:VCValidators
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
      this.returnUsername = params['username'];
    });
      this.form = this._fb.group({
          username: [this.returnUsername?this.returnUsername:"", [Validators.required,this._validators.username]]
      });

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      
        
  }
  ngAfterViewInit(): void {
    const sub = this.delay$.subscribe(c=>{
        this.focus();    
    })
    this.allSubscriptions.push(sub);
}

  focus(){
    this.focusSubject.next(true)
  }
  onSubmit(form:FormGroup) {
      
      // stop here if form is invalid
      if (form.invalid) {
          return;
      }

      this.loadingSubject.next(true);
     this.reset({username:form.controls.username.value})
  }
  reset({username}:any){
     const sub = this.authenticationService.resetPassword({username})
      .pipe(first())
      .subscribe(
          data => {
              // console.log("Logged In ", data)
              this.loadingSubject.next(false);
              this.apiSuccessSubject.next("Your new password has been sent to your email address "+data?.name);
          },
          error => {
              // this.error = error;
              // let err = "Small wahala dey with connectivity, abeg retry"
              // // if(error=="Not Found")
              // console.log(error)
              
        setTimeout(()=>{this.apiErrorSubject.next("Error: "+error);this.loadingSubject.next(false);},1000)
        setTimeout(()=>{this.apiErrorSubject.next();},5000)
          });
          this.allSubscriptions.push(sub);
  }
    onNavigate(route:string,params:any={}):void{
      this._router.navigate([route],{queryParams: params})
    }
    onError(value:any):void{
      this.errorMessageSubject.next(value);
    }
}

