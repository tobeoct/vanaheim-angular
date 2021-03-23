import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestmentsComponent } from './investments/investments.component';
import { LoansComponent } from './loans/loans.component';
import { OnboardingComponent } from './onboarding/onboarding.component';

const routes: Routes = [
    {path:"loans", component: LoansComponent},
    {path:"investments",component:InvestmentsComponent},
  {path:"home", component:OnboardingComponent},
  {path:"**", redirectTo:"home"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
