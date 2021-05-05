import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/shared/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { NavigationComponent } from './navigation/navigation.component';
import { CustomerComponent } from './customer.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [DashboardComponent, NavigationComponent, CustomerComponent, HeaderComponent],
  imports: [
    SharedModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
