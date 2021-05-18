import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentComponent } from './document/document.component';
import { AccountInfoComponent } from './personal/account-info/account-info.component';
import { ApplyingAsComponent } from './personal/applying-as/applying-as.component';
import { BVNComponent } from './personal/bvn/bvn.component';
import { EmploymentInfoComponent } from './personal/employment-info/employment-info.component';
import { LoanCalculatorComponent } from './personal/loan-calculator/loan-calculator.component';
import { LoanProductComponent } from './personal/loan-product/loan-product.component';
import { LoantypeComponent } from './personal/loantype/loantype.component';
import { NOKInfoComponent } from './personal/nok-info/nok-info.component';
import { PersonalInfoComponent } from './personal/personal-info/personal-info.component';

const routes: Routes = [
  {path:"loan-calculator", component:LoanCalculatorComponent},
  {path:"loan-product", component:LoanProductComponent},
{path:"applying-as", component:ApplyingAsComponent},
{path:"loan-type", component:LoantypeComponent},
{path:"bvn-info", component:BVNComponent},
{path:"personal-info", component:PersonalInfoComponent},
{path:"employment-info", component:EmploymentInfoComponent},
{path:"account-info", component:AccountInfoComponent},
{path:"nok-info", component:NOKInfoComponent},
{path:"upload", component:DocumentComponent},
{path:"**", redirectTo:"loan-type"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
