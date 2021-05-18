import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusDirective } from './focus.directive';
import { BaseModule } from '../base.module';



@NgModule({
  declarations: [
    FocusDirective],
  imports: [
    BaseModule
  ],
  exports:[
    FocusDirective]
})
export class DirectivesModule { }
