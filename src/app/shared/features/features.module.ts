import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FaqComponent } from './faq/faq.component';
import { NotificationComponent } from './notification/notification.component';
import { BaseModule } from '../base.module';
import { LoanHeaderComponent } from 'src/app/modules/loan/layout/header/header.component';
import { ApplyingAsComponent } from 'src/app/modules/loan/shared/applying-as/applying-as.component';
import { LoanProductComponent } from 'src/app/modules/loan/shared/loan-product/loan-product.component';
import { ComponentsModule } from '../components/components.module';
import { LoantypeComponent } from 'src/app/modules/loan/shared/loantype/loantype.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { PersonalInfoComponent } from 'src/app/modules/loan/personal/personal-info/personal-info.component';
import { NOKInfoComponent } from 'src/app/modules/loan/personal/nok-info/nok-info.component';
import { SideNOKComponent } from './nok/nok.component';
import { AccountInfoComponent } from 'src/app/modules/loan/shared/account-info/account-info.component';
import { SideAccountComponent } from './account/account.component';
import { SideContactComponent } from './contact-us/contact-us.component';
import { SidePasswordComponent } from './password/password.component';
import { BVNComponent } from 'src/app/modules/loan/personal/bvn/bvn.component';
import { SideBVNComponent } from './bvn/bvn.component';



@NgModule({
  declarations: [
    FaqComponent,
    NotificationComponent,
    LoanHeaderComponent,
    LoantypeComponent,
    ApplyingAsComponent,
    LoanProductComponent,
    PersonalDetailsComponent,
    PersonalInfoComponent,
    NOKInfoComponent,
    SideNOKComponent,
    BVNComponent,
    AccountInfoComponent,
    SideAccountComponent,
    SideContactComponent,
    SidePasswordComponent,
    SideBVNComponent
  ],
  imports: [
    BaseModule,
    ComponentsModule
  ],
  exports: [
    FaqComponent,
    NotificationComponent,
    LoanHeaderComponent,
    LoantypeComponent,
    ApplyingAsComponent,
    LoanProductComponent,
    PersonalDetailsComponent,
    PersonalInfoComponent,
    NOKInfoComponent,
    SideNOKComponent,
    BVNComponent,
    AccountInfoComponent,
    SideAccountComponent,
    SideContactComponent,
    SidePasswordComponent,
    SideBVNComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeaturesModule { }
