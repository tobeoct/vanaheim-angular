import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
isLoggedIn:boolean;
  constructor(private _authService:AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
  }

}
