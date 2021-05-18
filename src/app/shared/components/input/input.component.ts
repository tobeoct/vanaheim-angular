import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Utility } from 'src/app/shared/helpers/utility.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() type:string = "text";
  @Input() value:string;
  @Input() fieldClass:string;
  @Input() min:number;
  @Input() label:string;
  @Input() error:string;
  @Input() max:number;
  @Input() placeholder:string;
  @Input() control:FormControl;
  @Input() class:string;
  @Input() required:boolean;
  @Input() id:string;
  @Input() hidden:boolean;
  @Input() errorType:string = "default";
  @Input() focus$:Observable<boolean>;
  @Output() valueChange = new EventEmitter();
  isRequired:boolean= true;
  constructor(private utility:Utility) { 
   
  }

  ngOnInit(): void {
  }
  
  onChange(event:any){
      this.valueChange.emit(event.target.value);
  }

}
