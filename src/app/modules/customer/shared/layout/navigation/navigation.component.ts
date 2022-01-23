import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserCategory } from '@enums/usercategory';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ElementStyle, ElementSize, ElementState } from 'src/app/shared/constants/enum';
import { ButtonOptions } from 'src/app/shared/constants/variables';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';

@Component({
  selector: 'app-customer-navigation',
  templateUrl: './navigation.component.html',
  styles: [`
  

  `
  ]
})
export class NavigationComponent implements OnInit {

  @Input() type:UserCategory;
  logoutSub:Subscription;
  confirmSub:Subscription;
  loanButtonOptions:ButtonOptions= new ButtonOptions("Loans",ElementStyle.stroke,"",ElementSize.small,true,ElementState.active);
  invButtonOptions:ButtonOptions= new ButtonOptions("Investment",ElementStyle.stroke,"",ElementSize.small,true,ElementState.default);
active$:Observable<string>;

shouldLogOutSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,private _loanService:LoanService, private authenticationService: AuthService, private _utility:Utility) {
    
    this.active$ = this._utility.activeSolution$;
   }
  ngOnDestroy(): void {
    if(this.logoutSub)this.logoutSub.unsubscribe()
    if(this.confirmSub)this.confirmSub.unsubscribe()
  }
  ngOnInit(): void {

  this.confirmSub =  this.shouldLogOutSubject.asObservable().subscribe(s=>{
      if(s==true){

        this.logoutSub = this.authenticationService.logout().subscribe()
      }
    })
  }

  onNavigate(route:string){
    this.router.navigate([route])
  }

  logout(){
    // console.log("Logging Out ",this._loanService.activeLoanSubject.value, this._loanService.runningLoanSubject.value)
    // let activeLoan = this._loanService.activeLoanSubject.value || (this._loanService.runningLoanSubject.value && localStorage.getItem("page"))
    // if(this._loanService.activeLoanSubject.value ==activeLoan){
    //   let confirm =window.confirm( 'Are you sure you want to leave? You would lose your application progress.');
    //   this.shouldLogOutSubject.next( confirm)
    // }
    // else{
      
      this.logoutSub = this.authenticationService.logout().subscribe()
    // }
  }


}
