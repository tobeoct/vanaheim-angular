import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'src/app/shared/guards/admin.guard';
import { AuthComponent } from '../auth/auth.component';
import { EarningsComponent } from './earnings/earnings.component';
import { NotifyComponent } from './notify/notify.component';
import { RequestComponent } from './request/request.component';
const AUTH_ROUTES: Routes = [
  {path:"",loadChildren:()=>import('../../modules/auth/auth.module').then(m=>m.AuthModule)}
]

const routes: Routes = [
  {path:"earnings", component:EarningsComponent,canActivate:[ AdminGuard]},
{path:"loans", component:RequestComponent,canActivate:[ AdminGuard]},
{path:"notify", component:NotifyComponent},// canActivate:[ AdminGuard]},
{path:"auth", component: AuthComponent, children: AUTH_ROUTES },
{path:"**", redirectTo:"loans"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
