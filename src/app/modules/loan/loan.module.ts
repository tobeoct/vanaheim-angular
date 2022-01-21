import { NgModule } from '@angular/core';
import { LoanComponent } from './loan.component';
import { LoanRoutingModule } from './loan-routing.module';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoanCalculatorComponent } from './shared/loan-calculator/loan-calculator.component';
import { BVNComponent } from './personal/bvn/bvn.component';
// import { PersonalInfoComponent } from './personal/personal-info/personal-info.component';
import { EmploymentInfoComponent } from './personal/employment-info/employment-info.component';
import {  DocumentUploadComponent } from './shared/document-upload/document-upload.component';
import { PreviewComponent } from './shared/preview/preview.component';
import { CompanyInfoComponent } from './business/company-info/company-info.component';
import { AdditionalInfoComponent } from './business/additional-info/additional-info.component';
import { ShareholderInfoComponent } from './business/shareholder-info/shareholder-info.component';
import { CollateralInfoComponent } from './business/collateral-info/collateral-info.component';
import { AccountFormComponent } from './shared/account-info/account-form/account-form.component';



@NgModule({
  declarations: [
    LoanComponent,
     NavigationComponent,
    LoanCalculatorComponent,
     EmploymentInfoComponent,
     DocumentUploadComponent,
     PreviewComponent,
     CompanyInfoComponent,
     AdditionalInfoComponent,
     ShareholderInfoComponent,
     CollateralInfoComponent,
     AccountFormComponent,

    ],
  imports: [
    LoanRoutingModule,
    SharedModule
  ]
})
export class LoanModule { }
