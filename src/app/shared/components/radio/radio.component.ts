import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { RadioButtonItem } from '../../interfaces/radio-button-item';
let nextUniqueId=0;
@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit, AfterViewInit {
  @Input() items:RadioButtonItem[]=[];
itemsSubject:BehaviorSubject<RadioButtonItem[]> = new BehaviorSubject<RadioButtonItem[]>(this.items);
  items$: Observable<RadioButtonItem[]>= this.itemsSubject.asObservable();
  @Input()
  outline:boolean = false; 
  @Input()
  class:string;
  @Input()
  control:FormControl;
  @Input()
  id:string = `group-${nextUniqueId++}`;
  @Input()
  value:string;
activeSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
active$:Observable<boolean> = this.activeSubject.asObservable();
  constructor(private cdRef: ChangeDetectorRef ) { }
  ngAfterViewInit(): void {
    this.itemsSubject.next(this.items);
    this.cdRef.detectChanges();
  }

 
  ngOnInit(): void {
    this.configure()
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

  toggle(label:string){
  let i= this.items.map(item=>{
     if(item.label===label){item.selected=true;this.control.patchValue(item.value);this.control.updateValueAndValidity()}else{item.selected=false;}
     return item;
   });
   this.itemsSubject.next(i);
  }


}
