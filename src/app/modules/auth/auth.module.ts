import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'src/shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SocialLoginModule } from 'angularx-social-login';


@NgModule({
  declarations: [RegisterComponent, LoginComponent],
  imports: [
    AuthRoutingModule,
    SharedModule,
    SocialLoginModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }
