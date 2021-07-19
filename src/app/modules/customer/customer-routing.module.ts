import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlowGuard } from 'src/app/shared/guards/loan/flow.guard';
import { LoanComponent } from '../loan/loan.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentComponent } from './document/document.component';
import { LoansComponent } from './loans/loans.component';
const LOAN_ROUTES: Routes = [
  {path:"",loadChildren:()=>import('../loan/loan.module').then(m=>m.LoanModule)}
]

const routes: Routes = [
{path:"dashboard", component:DashboardComponent},
{path:"loans", component:LoansComponent},
{ path: 'loans/apply', component: LoanComponent, children: LOAN_ROUTES, canActivate:[FlowGuard] },
{path:"documents", component:DocumentComponent},
{path:"profile", component:AccountComponent},
{path:"**", redirectTo:"dashboard"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
