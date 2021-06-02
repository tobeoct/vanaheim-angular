import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserCategory } from '@models/helpers/enums/usercategory';
import { Observable, Subject, Subscription } from 'rxjs';
import { ElementStyle, ElementSize, ElementState } from 'src/app/shared/constants/enum';
import { ButtonOptions } from 'src/app/shared/constants/variables';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

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
  loanButtonOptions:ButtonOptions= new ButtonOptions("Loans",ElementStyle.stroke,"",ElementSize.small,true,ElementState.active);
  invButtonOptions:ButtonOptions= new ButtonOptions("Investment",ElementStyle.stroke,"",ElementSize.small,true,ElementState.default);
active$:Observable<string>;

  constructor(private router: Router, private authenticationService: AuthService, private _utility:Utility) {
    
    this.active$ = this._utility.activeSolution$;
   }
  ngOnDestroy(): void {
    if(this.logoutSub)this.logoutSub.unsubscribe()
  }
  ngOnInit(): void {
  }

  onNavigate(route:string){
    this.router.navigate([route])
  }

  logout(){
    console.log("Logging Out")
    this.logoutSub = this.authenticationService.logout().subscribe()
  }


}
