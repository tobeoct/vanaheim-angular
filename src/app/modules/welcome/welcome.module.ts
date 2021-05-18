import { NgModule ,CUSTOM_ELEMENTS_SCHEMA, ApplicationRef} from '@angular/core';
import { CardComponent } from './investments/investment-form/card/card.component';
import { InvestmentsComponent } from './investments/investments.component';
import { RateComponent } from './investments/investment-form/rate/rate.component';
import { RatecardComponent } from './investments/investment-form/rate/ratecard/ratecard.component';
import { LoansComponent } from './loans/loans.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { HeaderComponent } from 'src/app/modules/welcome/layout/header/header.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { WelcomeNavigationComponent } from './layout/navigation/navigation.component';
import { InvestmentFormComponent } from './investments/investment-form/investment-form.component';

@NgModule({
  declarations: [
    InvestmentsComponent,
    CardComponent,
    RateComponent,
    RatecardComponent,
    LoansComponent,
    OnboardingComponent,
    HeaderComponent,
    ModalComponent,
    WelcomeNavigationComponent,
    InvestmentFormComponent],
  
  imports: [
    SharedModule,
    WelcomeRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomeModule { 

  // constructor(injector:Injector){
  //   const acc = createCustomElement(AccordionComponent,{injector});
  //   customElements.define('my-accordion',acc);
  // }
  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(OnboardingComponent); // Or some other component
  }
}
