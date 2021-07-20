import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-side-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class SideAccountComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
