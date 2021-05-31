import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountInfoComponent } from './shared/account-info/account-info.component';
import { ApplyingAsComponent } from './shared/applying-as/applying-as.component';
import { LoanCalculatorComponent } from './shared/loan-calculator/loan-calculator.component';
import { LoanProductComponent } from './shared/loan-product/loan-product.component';
import { PreviewComponent } from './shared/preview/preview.component';
import { LoantypeComponent } from './shared/loantype/loantype.component';
import { DocumentUploadComponent } from './shared/document-upload/document-upload.component';
import { personalRoutes, businessRoutes } from 'src/app/shared/helpers/routes';

const routes: Routes = [
  ...personalRoutes,
  ...businessRoutes,
  {path:"loan-calculator", component:LoanCalculatorComponent},
  {path:"loan-product", component:LoanProductComponent},
{path:"applying-as", component:ApplyingAsComponent},
{path:"loan-type", component:LoantypeComponent},
{path:"account-info", component:AccountInfoComponent},
{path:"upload", component:DocumentUploadComponent},
{path:"preview", component:PreviewComponent},
{path:"**", redirectTo:"loan-type"},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
