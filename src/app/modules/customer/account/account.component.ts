import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SideNavigationList } from 'src/app/shared/constants/enum';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { User } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user:User;
  bvn$:Observable<any>
  constructor(private _utility:Utility, private _authService:AuthService, private _customerService:CustomerService) { }

  ngOnInit(): void {
    this.user = this._authService.userValue;
    this.bvn$ = this._customerService.getBVN();
  }
  toggleSideNav=(type:any)=>{
    type = type as SideNavigationList;
    this._utility.toggleSideNav(type);
  }
  logout(){
    this._authService.logout();
  }
  copy(text:string){
    this._utility.copyToClipboard(text);
  }
}
