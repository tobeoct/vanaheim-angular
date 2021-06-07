import { ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
@ViewChild('btn') button:ElementRef<HTMLElement>;
  @Input() form: FormGroup;
  @Input() class:string;
  @Input() fieldClass:string;
  @Input() title:string='Please fill the form first';
  @Input() autoClick:boolean;
  @Input() loading$:Observable<boolean>
  @Output() onClick = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
   
  }

  ngOnChanges(){
    if(this.autoClick==true){
      this.button.nativeElement.click()
    }
  }
  handleClick=(event:any)=>{
    this.onClick.next('');
  }
}
