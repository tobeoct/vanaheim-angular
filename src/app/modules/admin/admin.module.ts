import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestComponent } from './request/request.component';
import { SharedModule } from 'src/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { NotifyComponent } from './notify/notify.component';



@NgModule({
  declarations: [RequestComponent, NotifyComponent],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
