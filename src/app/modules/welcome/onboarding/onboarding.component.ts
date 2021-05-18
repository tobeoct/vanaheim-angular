import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetPath } from 'src/app/shared/constants/variables';
import {IAssetPath} from "src/app/shared/interfaces/assetpath";
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  constructor(private router: Router) { }
  assetPaths: IAssetPath = new AssetPath;
main:string="main";
nested:string="nested"
navtype:string = "onboarding";
headerclass:string ="header_mobi";
isClicked: boolean = false;

  ngOnInit(): void {
    
  }

  
onNavigate(route:string){
    this.router.navigate([route])
  }

}
