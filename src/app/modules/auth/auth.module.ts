import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'src/shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SocialLoginModule } from 'angularx-social-login';
import { AccountComponent } from './account/account.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FocusDirective } from 'src/app/directives/focus.directive';
import { AuthComponent } from './auth.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';


@NgModule({
  declarations: [RegisterComponent, LoginComponent, AccountComponent, NavigationComponent, AuthComponent, ForgotpasswordComponent],
  imports: [
    AuthRoutingModule,
    SharedModule,
    SocialLoginModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }
