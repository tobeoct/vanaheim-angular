import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { CustomerGuard } from './guards/customer.guard';
import { WelcomeGuard } from './guards/welcome.guard';

const routes: Routes = [
  {path:"welcome", loadChildren:()=>import('./modules/welcome/welcome.module').then(m=>m.WelcomeModule), canActivate:[WelcomeGuard]},
  {path:"my", loadChildren:()=>import('./modules/customer/customer.module').then(m=>m.CustomerModule), canActivate:[AuthenticationGuard, CustomerGuard] },
  {path:"admin", loadChildren:()=>import('./modules/admin/admin.module').then(m=>m.AdminModule), canActivate:[AuthenticationGuard, AdminGuard] },
  {path:"auth",loadChildren:()=>import('./modules/auth/auth.module').then(m=>m.AuthModule)},
  {path:"**", redirectTo:"welcome"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
