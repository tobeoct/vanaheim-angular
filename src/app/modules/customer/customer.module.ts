import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/shared/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
