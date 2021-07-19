import { Component, OnInit } from '@angular/core';
import { SideNavigationList } from 'src/app/shared/constants/enum';
import { Utility } from 'src/app/shared/helpers/utility.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private _utility:Utility) { }

  ngOnInit(): void {
  }
  toggleSideNav=(type:any)=>{
    type = type as SideNavigationList;
    console.log(type);
    this._utility.toggleSideNav(type);
  }
}
