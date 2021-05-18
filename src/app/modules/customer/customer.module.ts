import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { CustomerComponent } from './customer.component';
import { HeaderComponent } from './layout/header/header.component';
import { LoanSummaryComponent } from './dashboard/loan-summary/loan-summary.component';
import { InvestmentSummaryComponent } from './dashboard/investment-summary/investment-summary.component';
import { LoansComponent } from './loans/loans.component';



@NgModule({
  declarations: [DashboardComponent, NavigationComponent, CustomerComponent, HeaderComponent, LoanSummaryComponent, InvestmentSummaryComponent, LoansComponent],
  imports: [
    SharedModule,
    CustomerRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerModule { }
