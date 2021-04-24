import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { UserCategory } from 'src/shared/constants/enum';
import { AuthService } from 'src/shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnChanges, OnInit {
  title = 'vanaheim';
  isLoggedIn:Boolean = false;
  navType:UserCategory = UserCategory.customer;
  constructor(private authenticationService: AuthService){
  

  }
  ngOnInit(): void {
    this.authenticationService.user.pipe(debounceTime(100)).subscribe(user=>{
      this.navType = user.category;
      if (this.authenticationService.isLoggedIn()) { 
        this.isLoggedIn = true;
      }
      else{
        this.isLoggedIn = false;
      }
      console.log("is Logged In", this.isLoggedIn)
    })
  }
  ngOnChanges(): void {
   
    console.log("is Logged In", this.isLoggedIn)
  }

  // isLogged(){
   
  // }
}
