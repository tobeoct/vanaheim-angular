import { AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AssetPath } from 'src/app/shared/constants/variables';
import { IAssetPath } from 'src/app/shared/interfaces/assetpath';
import { InvestmentService } from './investment.service';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestmentsComponent implements OnInit,AfterViewInit {

assetPaths:IAssetPath = new AssetPath;
mobile:string = "sm-mobile";
desktop:string="sm-desktop";
headerclass:string ="header";
showModal:boolean=false;
modalType:string = 'investment-indication';
show$:Observable<boolean> 
show2$:Observable<boolean> 
 
apiSuccess$:Observable<string>;
apiError$:Observable<string>;
  ngOnInit(): void {
  }
 
constructor(private _investmentService:InvestmentService){
}
  ngAfterViewInit(): void {
    
  this.show$ = this._investmentService.show$;
  this.show2$ = this._investmentService.show2$;
  this.apiError$ = this._investmentService.apiError$;
  this.apiSuccess$ =this._investmentService.apiSuccess$;
  }
close=()=>{
  setTimeout(()=>{this._investmentService.show2(false);this._investmentService.show(false)},0);
  // this.apiErrorSubject.next();
  // this.apiSuccessSubject.next();
}
}


