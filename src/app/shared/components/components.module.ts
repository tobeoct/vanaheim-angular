import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LottieModule } from 'ngx-lottie';
import { BaseModule } from '../base.module';
import { DirectivesModule } from '../directives/directives.module';
import { FooterComponent } from '../layout/footer/footer.component';
import { SideNavigationComponent } from '../layout/side-navigation/side-navigation.component';
import { AccordionComponent } from './accordion/accordion.component';
import { BannerComponent } from './banner/banner.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { DropdownOptionComponent } from './dropdown/option/option.component';
import { FormComponent } from './form/form.component';
import { InputComponent } from './input/input.component';
import { SliderComponent } from './slider/slider.component';
import { TabBodyComponent } from './tab/tab-body/tab-body.component';
import { TabContainerComponent } from './tab/tab-container.component';
import { TabHeaderComponent } from './tab/tab-header/tab-header.component';
import { TabComponent } from './tab/tab/tab.component';
import { TableComponent } from './table/table.component';
import { TemplateComponent } from './template/template.component';
import player from 'lottie-web';
import { LottieComponent } from './lottie/lottie.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ButtonComponent } from './button/button.component';
import { ModalComponent } from './modal/modal.component';
import { ModalHeaderComponent } from './modal/modal-header/modal-header.component';
import { ModalBodyComponent } from './modal/modal-body/modal-body.component';
import { DateComponent } from './date/date.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ProgressComponent } from './progress/progress.component';
import { RadioComponent } from './radio/radio.component';
// import { LoadingComponent } from './loading/loading.component';
import { ProgressCircularComponent } from './progress/circular/circular.component';
import { BadgeComponent } from './badge/badge.component';
import { CopyComponent } from './copy/copy.component';
import { TypeAheadComponent } from './type-ahead/type-ahead.component';
import { TypeAheadOptionComponent } from './type-ahead/option/option.component';
import { DocumentComponent } from 'src/app/modules/loan/shared/document-upload/document/document.component';
import { CountdownComponent } from './countdown/countdown.component';

export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [
    CheckboxComponent,
    LottieComponent,
    InputComponent,
    ButtonComponent,
    AccordionComponent,
    FormComponent,
    FooterComponent,
    SideNavigationComponent,
    BannerComponent,
    TabContainerComponent,
    TabComponent,
    TabHeaderComponent,
    TabBodyComponent,
    TemplateComponent,
    TableComponent,
    SliderComponent,
    DropdownComponent,
    DropdownOptionComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    DateComponent,
    PaginationComponent,
    ProgressComponent,
    RadioComponent,
    // LoadingComponent,
    ProgressCircularComponent,
    BadgeComponent,
    CopyComponent,
    TypeAheadComponent,
    TypeAheadOptionComponent,
    DocumentComponent,
    CountdownComponent
  ],
  imports: [
    BaseModule, 
    DirectivesModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  exports:[
    RadioComponent,
    CheckboxComponent,
    LottieComponent,
    InputComponent,
    AccordionComponent,
    FormComponent,
    FooterComponent,
    SideNavigationComponent,
    BannerComponent,
    TabContainerComponent,
    TabComponent,
    TabHeaderComponent,
    TabBodyComponent,
    TemplateComponent,
    TableComponent,
    SliderComponent,
    DropdownComponent,
    DropdownOptionComponent,
    ButtonComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    DateComponent,
    PaginationComponent,
    ProgressComponent,
    // LoadingComponent,
    ProgressCircularComponent,
    BadgeComponent,
    CopyComponent,
    TypeAheadComponent,
    TypeAheadOptionComponent,
    DocumentComponent,
    CountdownComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
