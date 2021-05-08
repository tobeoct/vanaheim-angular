import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserCategory } from '@enums/usercategory';
import { Subscription } from 'rxjs';
import { ElementSize, ElementStyle, ElementState } from 'src/shared/constants/enum';
import { ButtonOptions } from 'src/shared/constants/variables';
import { Utility } from 'src/shared/helpers/utility.service';
import { AuthService } from 'src/shared/services/auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy {
  logoutSub:Subscription;
  loanButtonOptions:ButtonOptions= new ButtonOptions("Loans",ElementStyle.stroke,"",ElementSize.small,true,ElementState.active);
  invButtonOptions:ButtonOptions= new ButtonOptions("Investment",ElementStyle.stroke,"",ElementSize.small,true,ElementState.default);
  constructor(private router: Router, private authenticationService: AuthService, private _utility:Utility) { }
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
    console.log("Logging Out")
    this.logoutSub = this.authenticationService.logout().subscribe()
  }

}
