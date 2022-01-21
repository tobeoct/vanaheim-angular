import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetPath } from 'src/app/shared/constants/variables';
import { LoanStore, Store } from 'src/app/shared/helpers/store';
import {IAssetPath} from "src/app/shared/interfaces/assetpath";
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
  page$:Observable<string>;
  constructor(private _loanStore:LoanStore) {

   }

  ngOnInit(): void {
    this.page$ = this._loanStore.page$;
  }

  submit(event:any, type:string){
      event.preventDefault();
  }

}
