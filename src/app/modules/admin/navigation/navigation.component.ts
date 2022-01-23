import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserCategory } from '@enums/usercategory';
import { Subscription } from 'rxjs';
import { ElementStyle, ElementSize, ElementState } from 'src/app/shared/constants/enum';
import { ButtonOptions } from 'src/app/shared/constants/variables';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-admin-navigation',
  templateUrl: './navigation.component.html',
  styles: [
  ]
})
export class NavigationComponent implements OnInit {

  logoutSub:Subscription;
  loanButtonOptions:ButtonOptions= new ButtonOptions("Loans",ElementStyle.stroke,"",ElementSize.small,true,ElementState.active);
  invButtonOptions:ButtonOptions= new ButtonOptions("Investment",ElementStyle.stroke,"",ElementSize.small,true,ElementState.default);
  constructor(private router: Router, private authenticationService: AuthService) { }
  ngOnDestroy(): void {
    if(this.logoutSub)this.logoutSub.unsubscribe()
  }
  @Input() type:UserCategory;
  ngOnInit(): void {
  }

  onNavigate(route:string){
    this.router.navigate([route])
  }

  logout(){
    this.logoutSub = this.authenticationService.logout().subscribe()
  }
}
