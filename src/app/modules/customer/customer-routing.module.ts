import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EarningFlowGuard } from 'src/app/shared/guards/earnings/flow.guard';
import { FlowGuard } from 'src/app/shared/guards/loan/flow.guard';
import { LoanComponent } from '../loan/loan.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentsComponent } from './document/document.component';
import { EarningsFlowComponent } from '../earnings/earnings.component';
import { LoansComponent } from './loans/loans.component';
import { EarningsComponent } from './earnings/earnings.component';
const LOAN_ROUTES: Routes = [
  { path: "", loadChildren: () => import('../loan/loan.module').then(m => m.LoanModule) }
]
const EARNINGS_ROUTES: Routes = [
  { path: "", loadChildren: () => import('../earnings/earnings.module').then(m => m.EarningsModule) }
]
const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "loans/:id", component: LoansComponent },
  { path: "loans", component: LoansComponent },
  { path: 'loans/apply', component: LoanComponent, children: LOAN_ROUTES, canActivate: [FlowGuard] },
  { path: "earnings/:id", component: EarningsComponent },
  { path: "earnings", component: EarningsComponent },
  { path: 'earnings/apply', component: EarningsFlowComponent, children: EARNINGS_ROUTES, canActivate: [EarningFlowGuard] },
  { path: "documents", component: DocumentsComponent },
  { path: "profile", component: AccountComponent },
  { path: "**", redirectTo: "dashboard" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
