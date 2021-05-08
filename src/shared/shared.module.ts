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
import { FocusDirective } from 'src/app/directives/focus.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { DropdownSelectOptionComponent } from './components/dropdown/dropdown-select-option.component';
import { DropdownSelectComponent } from './components/dropdown/dropdown-select.component';
import { FormComponent } from './components/form/form.component';
import { SideNavigationComponent } from './layout/side-navigation/side-navigation.component';
import { FaqComponent } from './components/faq/faq.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { BannerComponent } from './components/banner/banner.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TabContainerComponent } from './components/tab/tab-container.component';
import { TabComponent } from './components/tab/tab/tab.component';
import { TabHeaderComponent } from './components/tab/tab-header/tab-header.component';
import { TabBodyComponent } from './components/tab/tab-body/tab-body.component';
import { TemplateComponent } from './components/template/template.component';
export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [
    LottieComponent,
    InputComponent,
    ButtonComponent,
    DragAndDropComponent,
    FocusDirective,
    AccordionComponent,
    DropdownSelectComponent,
    DropdownSelectOptionComponent,
    DropdownComponent,
    FormComponent,
    FooterComponent,
    SideNavigationComponent,
    FaqComponent,
    ToasterComponent,
    BannerComponent,
    NotificationComponent,
    TabContainerComponent,
    TabComponent,
    TabHeaderComponent,
    TabBodyComponent,
    TemplateComponent
  ],
  imports: [
    CommonModule,
    LottieModule.forRoot({ player: playerFactory }),
    ScrollingModule,
    DragDropModule,
    OverlayModule,
    PortalModule,
    ReactiveFormsModule,
    FormsModule
  ],
   exports:[
    LottieComponent,
    InputComponent,
    ButtonComponent,
    DragAndDropComponent,
    DropdownSelectComponent,
    DropdownSelectOptionComponent,
    DropdownComponent,
    FooterComponent,
    SideNavigationComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DragDropModule,
    ScrollingModule,
    FocusDirective,
    AccordionComponent,
    OverlayModule,
    PortalModule,
    FormComponent,
    FaqComponent,
    ToasterComponent,
    BannerComponent,
    NotificationComponent,
    TabContainerComponent,
    TabComponent,
    TabHeaderComponent,
    TabBodyComponent,
    TemplateComponent
   ],
   schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { 
  
 
}
