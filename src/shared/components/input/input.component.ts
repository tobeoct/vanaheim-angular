import { Component, Input, OnInit, Output,EventEmitter, OnChanges } from '@angular/core';
import { ValidationType,ElementSize } from 'src/shared/constants/enum';
import { InputOptions } from 'src/shared/constants/variables';
import { Utility } from 'src/shared/helpers/utility.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit,OnChanges {
  @Input() options:InputOptions;
  @Output() valueChange = new EventEmitter();
  errorMessage:string="";
  myClass:string="";
  isRequired:boolean= true;
  value:string;
  constructor(private utility:Utility) { 
   
  }

  ngOnInit(): void {
    this.configureInput()
  }

  ngOnChanges():void{
    this.configureInput()
  }

  
  configureInput(){
    let myClass ="";
    switch(this.options.size){
      case ElementSize.small:
        myClass+="widget_input--sm"
        break;
      default:
        break;
    }

    this.myClass = myClass += this.options.myClass;
  }
  onKeyPress(event:any){
   let isValid =  this.options.validationOptions.options.every(option=>{
     let type = option.type;
      let response = this.utility.filterInput(event,type);
      return response.isValid;
    })
    
    return isValid;
   
  }
  onKeyUp(event:any, ref:any){
    this.options.validationOptions.options.every(option=>{
      let type = option.type;
      let response = this.utility.filterInput(event,type,"up");
      if(response.isValid==true) {ref.value = response.value; this.onChange(event)}
      return response.isValid;
    })

   
  }

  onChange(event:any){
      this.valueChange.emit(event.target.value);
  }

}
