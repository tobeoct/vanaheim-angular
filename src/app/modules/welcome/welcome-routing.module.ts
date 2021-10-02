import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanDeactivateGuard } from 'src/app/shared/guards/loan/deactivate.guard';
import { LoanComponent } from '../loan/loan.component';
import { InvestmentsComponent } from './investments/investments.component';
import { LoansComponent } from './loans/loans.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
const LOAN_ROUTES: Routes = [
  {path:"",loadChildren:()=>import('../loan/loan.module').then(m=>m.LoanModule)}
]
const routes: Routes = [
    {path:"loans", component: LoansComponent},
    { path: 'loans/apply', component: LoanComponent, children: LOAN_ROUTES, canDeactivate: [LoanDeactivateGuard]},
    {path:"earnings",component:InvestmentsComponent},
  {path:"home", component:OnboardingComponent},
  {path:"**", redirectTo:"home"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
