import { Component, OnInit } from '@angular/core';
import { SideNavigationList } from 'src/app/shared/constants/enum';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { User } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user:User;
  constructor(private _utility:Utility, private _authService:AuthService) { }

  ngOnInit(): void {
    this.user = this._authService.userValue;
  }
  toggleSideNav=(type:any)=>{
    type = type as SideNavigationList;
    this._utility.toggleSideNav(type);
  }
  logout(){
    this._authService.logout();
  }
}
