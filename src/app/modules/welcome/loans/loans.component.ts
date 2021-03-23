import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ElementSize, ElementState, ElementStyle } from 'src/shared/constants/enum';
import { AssetPath, ButtonOptions } from 'src/shared/constants/variables';
import {IAssetPath} from "../../../../shared/interfaces/assetpath";
@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoansComponent implements OnInit {

  
  assetPaths:IAssetPath = new AssetPath;
  mobile:string = "sm-mobile";
  desktop:string="sm-desktop";
  headerclass:string ="header";
  buttonOptions:ButtonOptions= new ButtonOptions("Get Started",ElementStyle.default,"",ElementSize.small,true,ElementState.default);
  
  constructor() { }

  ngOnInit(): void {
  }

  submit(event:any, type:string){
      event.preventDefault();
  }

}
