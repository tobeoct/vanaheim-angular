import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
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
  @Input() control:FormControl = new FormControl();
  @Input() class:string;
  @Input() disabled:boolean;
  @Input() required:boolean;
  @Input() id:string;
  @Input() hidden:boolean;
  @Input() errorType:string = "default";
  @Input() focus$:Observable<boolean>;
  @Input() loading$:Observable<boolean>;
  @Output() valueChange = new EventEmitter();
  isRequired:boolean= true;

  showPasswordSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showPassword$:Observable<boolean> = this.showPasswordSubject.asObservable();

  constructor(private utility:Utility) { 
   
  }

  ngOnInit(): void {
  }
  
  onChange(event:any){
      this.valueChange.emit(event.target.value);
  }

  togglePassword(){
    this.showPasswordSubject.next(!this.showPasswordSubject.value);
  }

}
