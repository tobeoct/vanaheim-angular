import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from 'src/app/modules/auth/account/account.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path:"", component: AccountComponent},
  {path:"account", component: AccountComponent},
  {path:"forgot-password", component: ForgotpasswordComponent},
  {path:"forgot-password/:username", component: ForgotpasswordComponent},
    {path:"login", component: LoginComponent},
    {path:"login/:username", component: LoginComponent},
    {path:"register",component:RegisterComponent},
    {path:"register/:email",component:RegisterComponent},
  {path:"**", redirectTo:"account"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
