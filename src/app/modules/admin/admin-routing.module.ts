import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';
import { NotifyComponent } from './notify/notify.component';
import { RequestComponent } from './request/request.component';


const routes: Routes = [
{path:"requests", component:RequestComponent, canActivate:[AuthenticationGuard]},
{path:"notify", component:NotifyComponent, canActivate:[AuthenticationGuard]},
{path:"**", redirectTo:"requests"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
