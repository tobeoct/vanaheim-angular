import { ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AssetPath } from 'src/app/shared/constants/variables';
import { IAssetPath } from 'src/app/shared/interfaces/assetpath';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestmentsComponent implements OnInit {

assetPaths:IAssetPath = new AssetPath;
mobile:string = "sm-mobile";
desktop:string="sm-desktop";
headerclass:string ="header";
showModal:boolean=false;
modalType:string = 'investment-indication';
  ngOnInit(): void {
  }
 

}


