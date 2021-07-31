import { Component, OnInit } from '@angular/core';
import { SideNavigationList } from '../../constants/enum';
import { Utility } from '../../helpers/utility.service';
@Component({
  selector: 'app-side-contact',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class SideContactComponent implements OnInit {

  constructor(private _utility: Utility) { }

  ngOnInit(): void {

  }

  toggleSideNav = (type: any) => {
    type = type as SideNavigationList;
    this._utility.toggleSideNav(type);
  }
}
