import { Component, ContentChildren, ElementRef, Input, OnInit, QueryList } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { startWith, delay, map } from 'rxjs/operators';
import { DropdownOptionComponent } from './option/option.component';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class DropdownComponent implements OnInit {
 
  @ContentChildren(DropdownOptionComponent) contentChildren : QueryList<DropdownOptionComponent>;
  @ContentChildren(DropdownOptionComponent) dropdowns : QueryList<DropdownOptionComponent>;
  constructor(private _eref: ElementRef) { }
  basePath="../../../../assets/illustrations/characters";
@Input()
class:string='';
@Input()
fieldClass:string='';
@Input()
type:string='';
@Input()
placeholder:string = '';
@Input()
control:FormControl;
@Input()
id:string='';
@Input()
current:string ='';
  dropdownItems$: Observable<DropdownOptionComponent[]>;
  currentSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  current$:Observable<string> = this.currentSubject.asObservable();
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$:Observable<boolean> = this.showSubject.asObservable();
   activeOption: DropdownOptionComponent;
  ngOnInit(): void {
    if(!this.placeholder){
   this.placeholder =this.current? this.current: this.type?.includes("icon")?"":"- select -";
    }
    this.currentSubject.next(this.placeholder);
    switch(this.type){
      case "icon":
        this.class+=" dropdown--icon";
        break;
      default:
        break;
    }
  }
  ngAfterContentInit(): void {
    this.dropdownItems$ = this.dropdowns.changes
      .pipe(startWith(""))
      .pipe(delay(0))
      .pipe(map(() => this.dropdowns.toArray()));
  }
  selectOption(option: DropdownOptionComponent) {
    this.currentSubject.next(option.value);
    this.showSubject.next(false);
    this.control?.patchValue(option.value);
  }
  onClick(event:any) {
    if (!this._eref.nativeElement.contains(event.target)) // or some similar check
    this.showSubject.next(false);
   }
  toggle(){
    this.showSubject.next(!this.showSubject.value);
  }
}
