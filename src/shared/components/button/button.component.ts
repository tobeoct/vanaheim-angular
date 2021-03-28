import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ElementSize, ElementStyle } from 'src/shared/constants/enum';
import { ButtonOptions } from 'src/shared/constants/variables';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, OnChanges {

  @Input() options: ButtonOptions;
  @Input() form: FormGroup;
  myclass:string="";
  constructor() { }

  ngOnInit(): void {
    this.toggleClass();
  }

   ngOnChanges():void{
    this.toggleClass();
   }

   toggleClass():void{
     this.myclass = "";
    switch(this.options.type){
      case ElementStyle.stroke:
        this.myclass +="widget_button--stroke"
        break;
        case ElementStyle.fill:
          this.myclass +="widget_button--fill"
         break;
    }
    this.myclass +=" ";
    switch(this.options.size){
     case ElementSize.small:
       this.myclass +="widget_button--small"
       break;
       case ElementSize.large:
         this.myclass+="widget_button--large"
        break;
   }
   }
}
