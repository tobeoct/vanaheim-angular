import { NgModule } from '@angular/core';
import { EarningsFlowComponent } from './earnings.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { EarningsRoutingModule } from './earnings-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountInfoComponent } from './account-info/account-info.component';
import { EmploymentInfoComponent } from './employment-info/employment-info.component';
import { NOKInfoComponent } from './nok-info/nok-info.component';
import { DocumentUploadComponent } from './means-of-identification/document-upload.component';
import { EarningsCalculatorComponent } from './earnings-calculator/earnings-calculator.component';
import { EarningsHeaderComponent } from './header/header.component';
import { PreviewComponent } from './preview/preview.component';



@NgModule({
  declarations: [EarningsFlowComponent,PersonalInfoComponent,AccountInfoComponent,EarningsHeaderComponent,NavigationComponent,PreviewComponent,EmploymentInfoComponent,NOKInfoComponent,DocumentUploadComponent,EarningsCalculatorComponent],
  imports: [
    EarningsRoutingModule,
    SharedModule
  ]
})
export class EarningsModule { }
