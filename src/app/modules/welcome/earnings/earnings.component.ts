import { AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AssetPath } from 'src/app/shared/constants/variables';
import { IAssetPath } from 'src/app/shared/interfaces/assetpath';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { EarningService } from '../../../shared/services/earning/earning.service';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EarningsComponent implements OnInit, AfterViewInit {

  assetPaths: IAssetPath = new AssetPath;
  mobile: string = "sm-mobile";
  desktop: string = "sm-desktop";
  headerclass: string = "header";
  showModal: boolean = false;
  modalType: string = 'earning-indication';
  showLogin$: Observable<boolean>

  isLoggedIn$:Observable<boolean>;
  email = new FormControl()
  ngOnInit(): void {
    this.isLoggedIn$ = this._authService.isLoggedInSubject.asObservable();
  }

  constructor(private _earningService: EarningService,private _router:Router, private _authService: AuthService) {

  }
  ngAfterViewInit(): void {

    this.showLogin$ = this._earningService.showLoginSubject.asObservable();
  }
 
  emailEntered(email:any){
    this.email.patchValue(email);
  }

  
  closeLogin = () => {
    this._earningService.showLogin(false);
  }
  login(): void {
    this._router.navigate(["auth/login"],{queryParams:{username:this.email.value}})
  }
}


