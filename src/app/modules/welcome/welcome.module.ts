import { NgModule ,CUSTOM_ELEMENTS_SCHEMA, ApplicationRef} from '@angular/core';
import { EarningsComponent } from './earnings/earnings.component';
import { LoansComponent } from './loans/loans.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { HeaderComponent } from 'src/app/modules/welcome/layout/header/header.component';
import { WelcomeNavigationComponent } from './layout/navigation/navigation.component';

@NgModule({
  declarations: [
    EarningsComponent,
    
    LoansComponent,
    OnboardingComponent,
    HeaderComponent,
    WelcomeNavigationComponent],
  
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
