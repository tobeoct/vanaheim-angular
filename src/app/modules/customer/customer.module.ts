import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { NavigationComponent } from './shared/layout/navigation/navigation.component';
import { CustomerComponent } from './customer.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { LoanSummaryComponent } from './dashboard/loan-summary/loan-summary.component';
import { InvestmentSummaryComponent } from './dashboard/investment-summary/investment-summary.component';
import { LoansComponent } from './loans/loans.component';
import { LoanStatusComponent } from './shared/features/loan-status/loan-status.component';
import { DocumentsComponent } from './document/document.component';
import { NavComponent } from 'src/app/shared/layout/nav/nav.component';
import { AccountComponent } from './account/account.component';
import { EarningsComponent } from './earnings/earnings.component';
import { EarningStatusComponent } from './shared/features/earning-status/earning-status.component';
import { EarningsTrackerComponent } from './shared/features/earnings-tracker/earnings-tracker.component';
import { ReportComponent } from './loans/report/report.component';
import { LoanTrackerComponent } from './shared/features/loan-tracker/loan-tracker.component';



@NgModule({
  declarations: [DashboardComponent,EarningStatusComponent, NavigationComponent,NavComponent, CustomerComponent, HeaderComponent, LoanSummaryComponent, InvestmentSummaryComponent, LoansComponent, LoanStatusComponent, DocumentsComponent, AccountComponent, EarningsComponent, EarningsTrackerComponent, ReportComponent,LoanTrackerComponent],
  imports: [
    SharedModule,
    CustomerRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerModule { }
