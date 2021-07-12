import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AssetPath } from 'src/app/shared/constants/variables';
import {IAssetPath} from "src/app/shared/interfaces/assetpath";
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  @ViewChild('invest') invest:ElementRef;
  showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  show$:Observable<boolean> = this.showSubject.asObservable();
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

  moveToApply():void {
    this.invest.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
    this.showSubject.next(false);
}

}
