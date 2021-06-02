import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserCategory } from '@models/helpers/enums/usercategory';
import { Observable, Subscription } from 'rxjs';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { ElementStyle, ElementSize, ElementState, SideNavigationList } from '../../constants/enum';
import { ButtonOptions } from '../../constants/variables';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  main:string="main";
  nested:string="nested"
  navtype:string = "onboarding";
  headerclass:string ="header_mobi";
  isClicked: boolean = false;
  class:string="left dark"

  
  @Input() type:UserCategory;
  logoutSub:Subscription;
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
    this.router.navigate([route]);
    this._utility.activeNavigationSubject.next(SideNavigationList.close);
  }

  logout(){
    console.log("Logging Out")
    this.logoutSub = this.authenticationService.logout().subscribe()
  }



}
