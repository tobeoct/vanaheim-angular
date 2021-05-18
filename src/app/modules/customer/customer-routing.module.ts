import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanComponent } from '../loan/loan.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoansComponent } from './loans/loans.component';
const LOAN_ROUTES: Routes = [
  {path:"",loadChildren:()=>import('../loan/loan.module').then(m=>m.LoanModule)}
]

const routes: Routes = [
{path:"dashboard", component:DashboardComponent},
{path:"loans", component:LoansComponent},
{ path: 'loans/apply', component: LoanComponent, children: LOAN_ROUTES },
{path:"**", redirectTo:"dashboard"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
