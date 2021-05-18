import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from 'src/app/shared/helpers/store';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
@Component({
  selector: 'app-loan-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class LoanHeaderComponent implements OnInit, OnChanges {
title$:Observable<string>;
loanType$:Observable<string>;
loanProduct$:Observable<string>;
applyingAs$:Observable<string>;
isLoggedIn:boolean;
base="welcome/loans/apply/";
  constructor(private _store:Store, private _router:Router, private _route:ActivatedRoute,private _location: Location, private _authService:AuthService) {
    
   }

  ngOnInit(): void {
    this.title$ = this._store.title$;
    this.applyingAs$ = this._store.applyingAs$;
    this.loanProduct$ = this._store.loanProduct$;
    this.loanType$= this._store.loanType$;
    this.isLoggedIn = this._authService.isLoggedIn();
  }

  ngOnChanges(){
    this.isLoggedIn = this._authService.isLoggedIn();
  }

  back=()=>{
  
    this._store.back();
    
    if(this._router.url!="/welcome/loans"){
      this._location.back();
    // this.onNavigate(this._store.previousSubject.value);
  }
  }
  onNavigate(route:string,params:any={}):void{
    const r =this.base+route;
    this._router.navigate([r],{queryParams: params})
  }
}
