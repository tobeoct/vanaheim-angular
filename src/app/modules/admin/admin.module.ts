import { NgModule } from '@angular/core';
import { RequestComponent } from './request/request.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { NotifyComponent } from './notify/notify.component';
import { AdminComponent } from './admin.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoanRequestComponent } from './request/loan-request/loan-request.component';
import { EarningsRequestComponent } from './request/earnings-request/earnings-request.component';
import { EarningsComponent } from './earnings/earnings.component';



@NgModule({
  declarations: [RequestComponent, NotifyComponent, AdminComponent, NavigationComponent, LoanRequestComponent, EarningsRequestComponent, EarningsComponent],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
