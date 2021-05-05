import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestComponent } from './request/request.component';
import { SharedModule } from 'src/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { NotifyComponent } from './notify/notify.component';
import { AdminComponent } from './admin.component';
import { NavigationComponent } from './navigation/navigation.component';



@NgModule({
  declarations: [RequestComponent, NotifyComponent, AdminComponent, NavigationComponent],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
