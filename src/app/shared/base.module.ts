import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReplacePipe } from './pipes/replace/replace.pipe';
import { ConvertToFormControlPipe } from './pipes/form/convert-to-formcontrol.pipe';
import { SplitCamelCasePipe } from './pipes/split/split-camel-case.pipe';
import { ConvertToFormGroupPipe } from './pipes/form/convert-to-formgroup.pipe copy';
import { ToasterComponent } from './components/toaster/toaster.component';



@NgModule({
  declarations: [ToasterComponent,
    ReplacePipe,ConvertToFormControlPipe,ConvertToFormGroupPipe,SplitCamelCasePipe],
  imports: [ ScrollingModule,
    DragDropModule,
    OverlayModule,
    PortalModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    ToasterComponent,
    ScrollingModule,
    DragDropModule,
    OverlayModule,
    PortalModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReplacePipe,
    ConvertToFormControlPipe,
    ConvertToFormGroupPipe,
    SplitCamelCasePipe
  ]
})
export class BaseModule { }
