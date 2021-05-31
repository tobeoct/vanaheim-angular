import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() class:string;
  @Input() fieldClass:string;
  @Input() loading$:Observable<boolean>
  @Output() onClick = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  handleClick=(event:any)=>{
    this.onClick.next('');
  }
}
