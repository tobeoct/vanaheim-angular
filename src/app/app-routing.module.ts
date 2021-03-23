import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:"welcome", loadChildren:()=>import('./modules/welcome/welcome.module').then(m=>m.WelcomeModule)},
  {path:"my", loadChildren:()=>import('./modules/customer/customer.module').then(m=>m.CustomerModule)},
  {path:"admin", loadChildren:()=>import('./modules/admin/admin.module').then(m=>m.AdminModule)},
  {path:"**", redirectTo:"welcome"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
