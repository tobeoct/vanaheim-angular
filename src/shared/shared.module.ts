import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { LottieComponent } from './components/lottie/lottie.component';
import { InputComponent } from './components/input/input.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { ButtonComponent } from './components/button/button.component';
import { DragAndDropComponent } from './components/drag-and-drop/drag-and-drop.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { ModalComponent } from './modal/modal.component';
import { createCustomElement } from '@angular/elements';
export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [
    LottieComponent,
    InputComponent,
    ButtonComponent,
    DragAndDropComponent,
    DropdownComponent, 
    
  ],
  imports: [
    CommonModule,
    LottieModule.forRoot({ player: playerFactory }),
    ScrollingModule,
    DragDropModule
  ],
   exports:[
    LottieComponent,
    InputComponent,
    ButtonComponent,
    DragAndDropComponent,
    DropdownComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DragDropModule,
    ScrollingModule
   ],
   schemas: [ CUSTOM_ELEMENTS_SCHEMA],
   entryComponents:[AccordionComponent]
})
export class SharedModule { 

  constructor(injector:Injector){
    const acc = createCustomElement(AccordionComponent,{injector});
    customElements.define('my-accordion',acc);
  }
}
