import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment = require('moment');
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { SideNavigationList } from 'src/app/shared/constants/enum';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { User } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-customer-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
user:User;
greetingSubject:BehaviorSubject<string> = new BehaviorSubject<string>('');
greeting$:Observable<string> = this.greetingSubject.asObservable();
emojiSubject:BehaviorSubject<string> = new BehaviorSubject<string>('sun');
emoji$:Observable<string> = this.emojiSubject.asObservable();
  constructor(private _utility:Utility, private _router:Router, private _authService:AuthService) { }

  ngOnInit(): void {
    this.user = this._authService.userValue;
  }

  toggleSideNav=(type:any)=>{
    type = type as SideNavigationList;
    this._utility.toggleSideNav(type);
  }
  onNavigate(route:string){
    this._router.navigate([route])
  }
  timer$ = timer(0,50000).subscribe(c=>{
    if(moment().isBetween(moment().startOf("day"), moment().startOf("day").add("hours",4))){
      this.emojiSubject.next("crescent");
      this.greetingSubject.next("You should be sleeping");
    }else if(moment().isBetween(moment().startOf("day").add("hours",4), moment().startOf("day").add("hours",7))){
      this.emojiSubject.next("sun-smile");
      this.greetingSubject.next("Rise and Shine");
    }
    else if(moment().isBetween(moment().startOf("day").add("hours",7), moment().startOf("day").add("hours",12))){
      this.emojiSubject.next("sun");
      this.greetingSubject.next("Good Morning");
    }
    else if(moment().isBetween(moment().startOf("day").add("hours",12), moment().startOf("day").add("hours",18))){
      this.emojiSubject.next("sun");
      this.greetingSubject.next("Good Afternoon");
    }else{
      this.emojiSubject.next("moon");
      this.greetingSubject.next("Good Evening");
    }
  })
}
