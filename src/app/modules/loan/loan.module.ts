import { NgModule } from '@angular/core';
import { LoanComponent } from './loan.component';
import { LoanRoutingModule } from './loan-routing.module';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoanCalculatorComponent } from './personal/loan-calculator/loan-calculator.component';
import { BVNComponent } from './personal/bvn/bvn.component';
import { PersonalInfoComponent } from './personal/personal-info/personal-info.component';
import { EmploymentInfoComponent } from './personal/employment-info/employment-info.component';
import { AccountInfoComponent } from './personal/account-info/account-info.component';
import { NOKInfoComponent } from './personal/nok-info/nok-info.component';
import { DocumentComponent } from './document/document.component';



@NgModule({
  declarations: [LoanComponent, NavigationComponent,BVNComponent,LoanCalculatorComponent,PersonalInfoComponent, EmploymentInfoComponent, NOKInfoComponent, AccountInfoComponent, DocumentComponent],
  imports: [
    LoanRoutingModule,
    SharedModule
  ]
})
export class LoanModule { }
