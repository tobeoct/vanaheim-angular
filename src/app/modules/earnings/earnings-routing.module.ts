import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountInfoComponent } from './account-info/account-info.component';
import { EarningsCalculatorComponent } from './earnings-calculator/earnings-calculator.component';
import { EmploymentInfoComponent } from './employment-info/employment-info.component';
import { DocumentUploadComponent } from './means-of-identification/document-upload.component';
import { NOKInfoComponent } from './nok-info/nok-info.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PreviewComponent } from './preview/preview.component';
const routes: Routes = [
  {path:"account-info", component:AccountInfoComponent},
  
  {path:"personal-info", component:PersonalInfoComponent},
  {path:"employment-info", component:EmploymentInfoComponent},
  {path:"nok-info", component:NOKInfoComponent},
  {path:"earnings-calculator", component:EarningsCalculatorComponent},
  {path:"preview", component:PreviewComponent},
  {path:"means-of-identification", component:DocumentUploadComponent},
{path:"**", redirectTo:"personal-info"},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EarningsRoutingModule { }
