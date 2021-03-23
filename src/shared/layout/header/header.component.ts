import { Component, Input, OnInit } from '@angular/core';
import { ElementSize, ElementStyle, ElementState } from 'src/shared/constants/enum';
import { ButtonOptions } from 'src/shared/constants/variables';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() myclass:string;
  buttonOptions:ButtonOptions= new ButtonOptions("Get Started",ElementStyle.fill,"",ElementSize.small,false,ElementState.default);
  constructor() { }

  ngOnInit(): void {
  }

}
