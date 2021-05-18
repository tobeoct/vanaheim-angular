import { Component, Input, OnInit } from '@angular/core';
import { ElementSize, ElementStyle, ElementState, SideNavigationList } from 'src/app/shared/constants/enum';
import { ButtonOptions } from 'src/app/shared/constants/variables';
import { Utility } from 'src/app/shared/helpers/utility.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() myclass:string;
  buttonOptions:ButtonOptions= new ButtonOptions("Get Started",ElementStyle.fill,"",ElementSize.small,false,ElementState.default);
  constructor(private _utility:Utility) { }

  ngOnInit(): void {
  }
toggleSideNav=()=>{
this._utility.toggleSideNav(SideNavigationList.faq)
}
}
