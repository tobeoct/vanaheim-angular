import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavigationList } from 'src/app/shared/constants/enum';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { User } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-customer-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
user:User;
  constructor(private _utility:Utility, private _router:Router, private _authService:AuthService) { }

  ngOnInit(): void {
    this.user = this._authService.userValue;
  }

  toggleSideNav=(type:any)=>{
    type = type as SideNavigationList;
    console.log(type);
    this._utility.toggleSideNav(type);
  }
  onNavigate(route:string){
    this._router.navigate([route])
  }
}
