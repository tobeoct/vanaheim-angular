import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CardComponent } from './investments/card/card.component';
import { InvestmentsComponent } from './investments/investments.component';
import { RateComponent } from './investments/rate/rate.component';
import { RatecardComponent } from './investments/rate/ratecard/ratecard.component';
import { LoansComponent } from './loans/loans.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { SharedModule } from '../../../shared/shared.module';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { FooterComponent } from 'src/shared/layout/footer/footer.component';
import { HeaderComponent } from 'src/shared/layout/header/header.component';
import { NavigationComponent } from 'src/shared/layout/navigation/navigation.component';
import { ModalComponent } from 'src/shared/modal/modal.component';



@NgModule({
  declarations: [
    InvestmentsComponent,
    CardComponent,
    RateComponent,
    RatecardComponent,
    LoansComponent,
    OnboardingComponent,
    FooterComponent,
    NavigationComponent,
    HeaderComponent,
    ModalComponent,],
  imports: [
    SharedModule,
    WelcomeRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class WelcomeModule { 


}
