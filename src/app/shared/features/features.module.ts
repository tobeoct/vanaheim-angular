import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FaqComponent } from './faq/faq.component';
import { NotificationComponent } from './notification/notification.component';
import { BaseModule } from '../base.module';
import { LoanHeaderComponent } from 'src/app/modules/loan/layout/header/header.component';
import { ApplyingAsComponent } from 'src/app/modules/loan/personal/applying-as/applying-as.component';
import { LoanProductComponent } from 'src/app/modules/loan/personal/loan-product/loan-product.component';
import { LoantypeComponent } from 'src/app/modules/loan/personal/loantype/loantype.component';
import { ComponentsModule } from '../components/components.module';



@NgModule({
  declarations: [
    FaqComponent,
    NotificationComponent,
    LoanHeaderComponent,
    LoantypeComponent,
    ApplyingAsComponent,
    LoanProductComponent
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
    LoanProductComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class FeaturesModule { }
