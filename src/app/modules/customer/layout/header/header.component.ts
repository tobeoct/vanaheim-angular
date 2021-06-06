import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavigationList } from 'src/app/shared/constants/enum';
import { Utility } from 'src/app/shared/helpers/utility.service';

@Component({
  selector: 'app-customer-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private _utility:Utility, private _router:Router) { }

  ngOnInit(): void {
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
