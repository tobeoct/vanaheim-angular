import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
let nextUniqueId=0;
@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input()
  outline:boolean = false; 
  @Input()
  class:string;
  @Input()
  control:FormControl;
  @Input()
  id:string= `group-${nextUniqueId++}`;;
  @Input()
  value:string;
  @Input()
  active:boolean=false;
activeSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
active$:Observable<boolean> = this.activeSubject.asObservable();
  constructor() { }

 
  ngOnInit(): void {
    this.activeSubject.next(this.active);
    this.configure()
    // console.log(this.color)
  }
  ngOnChanges():void{
    this.configure()
  }
  configure(){
    if(this.outline==true) {
      if(!this.class) this.class='';
      this.class+=' checkbox--stroke';
    }
  }

  toggle(){
    this.activeSubject.next(!this.activeSubject.value);
    if(this.activeSubject.value==true){this.control.patchValue(this.value)}
    else{
      this.control.patchValue('');
    }
  }

}
