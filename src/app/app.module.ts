import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule, DoBootstrap, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ContactComponent } from '../shared/layout/contact/contact.component';
import { CommaseperatedPipe } from 'src/shared/pipes/commaseparated/commaseperated.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BasicAuthInterceptor } from './guards/http-interceptor';
import { ErrorInterceptor } from './guards/error-interceptor';
import { NavigationComponent } from 'src/shared/layout/navigation/navigation.component';
import { CommonModule } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {  SocialAuthServiceConfig } from 'angularx-social-login';
import {FacebookLoginProvider,GoogleLoginProvider } from 'angularx-social-login';
import { PageComponent } from '../shared/layout/page/page.component';
import { createCustomElement } from '@angular/elements';
import { AccordionComponent } from 'src/shared/components/accordion/accordion.component';
import { SharedModule } from 'src/shared/shared.module';

 
// Note we need a separate function as it's required
// by the AOT compiler.

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    CommaseperatedPipe,
    NavigationComponent,
    PageComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '500550636813-p4laejnae3rk9shj2ca8d073entooqe4.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              '1117567112081596'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }    
],
  bootstrap:[],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
 entryComponents:[AccordionComponent]
})
// bootstrap: [AppComponent],
export class AppModule implements DoBootstrap { 
  constructor(injector:Injector){
    const acc = createCustomElement(AccordionComponent,{injector});
    customElements.define('vc-accordion',acc);
  }
  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent); // Or some other component
  }
}
