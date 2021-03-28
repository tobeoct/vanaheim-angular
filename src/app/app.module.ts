import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule, DoBootstrap, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ContactComponent } from '../shared/layout/contact/contact.component';
import { CommaseperatedPipe } from 'src/shared/pipes/commaseparated/commaseperated.pipe';


 
// Note we need a separate function as it's required
// by the AOT compiler.

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    CommaseperatedPipe
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
    // SharedModule
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  bootstrap:[],
  
})
// bootstrap: [AppComponent],
export class AppModule implements DoBootstrap { 
 
  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent); // Or some other component
  }
}
