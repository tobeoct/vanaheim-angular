import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './shared/guards/admin.guard';
import { AuthenticationGuard } from './shared/guards/authentication.guard';
import { CustomerGuard } from './shared/guards/customer.guard';
import { WelcomeGuard } from './shared/guards/welcome.guard';
import { AdminComponent } from './modules/admin/admin.component';
import { AuthComponent } from './modules/auth/auth.component';
import { CustomerComponent } from './modules/customer/customer.component';
 const AUTH_ROUTES: Routes = [
  {path:"",loadChildren:()=>import('./modules/auth/auth.module').then(m=>m.AuthModule)}
]
 const CUSTOMER_ROUTES: Routes = [
  {path:"",loadChildren:()=>import('./modules/customer/customer.module').then(m=>m.CustomerModule), canActivate:[AuthenticationGuard, CustomerGuard]}
]
const ADMIN_ROUTES: Routes = [
  {path:"", loadChildren:()=>import('./modules/admin/admin.module').then(m=>m.AdminModule), canActivate:[AuthenticationGuard, AdminGuard]}
]
const routes: Routes = [
  {path:"welcome", loadChildren:()=>import('./modules/welcome/welcome.module').then(m=>m.WelcomeModule), canActivate:[WelcomeGuard]},
  { path: 'my', component: CustomerComponent, children: CUSTOMER_ROUTES },
  {path:"admin", component: AdminComponent, children: ADMIN_ROUTES },
  // {path:"auth",loadChildren:()=>import('./modules/auth/auth.module').then(m=>m.AuthModule)},
  { path: 'auth', component: AuthComponent, children: AUTH_ROUTES },
  {path:"**", redirectTo:"welcome"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
