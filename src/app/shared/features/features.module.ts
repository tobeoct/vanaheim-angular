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



@NgModule({
  declarations: [
    FaqComponent,
    NotificationComponent,
    LoanHeaderComponent,
    LoantypeComponent,
    ApplyingAsComponent,
    LoanProductComponent,
    PersonalDetailsComponent
  ],
  imports: [
    BaseModule,
    ComponentsModule
  ],
  exports:[
    FaqComponent,
    NotificationComponent,
    LoanHeaderComponent,
    LoantypeComponent,
    ApplyingAsComponent,
    LoanProductComponent,
    PersonalDetailsComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class FeaturesModule { }
