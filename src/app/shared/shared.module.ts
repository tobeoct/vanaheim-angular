import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BaseModule } from './base.module';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { FeaturesModule } from './features/features.module';

@NgModule({
  declarations: [
  ],
  imports: [
    BaseModule,
    ComponentsModule,
    DirectivesModule,
    FeaturesModule
  ],
   exports:[
   BaseModule,
   DirectivesModule,
    ComponentsModule,
   FeaturesModule
   ],
   schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { 
  
 
}
