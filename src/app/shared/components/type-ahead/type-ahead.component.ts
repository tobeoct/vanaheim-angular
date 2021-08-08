import { Component, ContentChildren, ElementRef, Input, OnInit, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, delay, map } from 'rxjs/operators';
import { TypeAheadOptionComponent } from './option/option.component';

@Component({
  selector: 'app-type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class TypeAheadComponent implements OnInit {

  @ContentChildren(TypeAheadOptionComponent) contentChildren: QueryList<TypeAheadOptionComponent>;
  @ContentChildren(TypeAheadOptionComponent) dropdowns: QueryList<TypeAheadOptionComponent>;
  constructor(private _eref: ElementRef) { }
  basePath = "../../../../assets/illustrations/characters";
  @Input()
  class: string = '';
  @Input()
  fieldClass: string = '';
  @Input()
  placeholder: string = '- select -';
  @Input()
  control: FormControl;
  @Input()
  id: string = '';
  @Input()
  current: string = '';
  dropdownItems$: Observable<TypeAheadOptionComponent[]>;
  currentSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  current$: Observable<string> = this.currentSubject.asObservable();
  // filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  // filter$: Observable<string> = this.filterSubject.asObservable();
  filteredDropDownItems$: Observable<TypeAheadOptionComponent[]>;
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  activeOption: TypeAheadOptionComponent;
  ngOnInit(): void {
    this.currentSubject.next(this.current ? this.current : this.placeholder);
    this.control.valueChanges.subscribe(c => console.log(c))
  }
  ngOnChanges() {
    this.currentSubject.next(this.current ? this.current : this.placeholder);
  }
  ngAfterContentInit(): void {
    this.dropdownItems$ = this.dropdowns.changes
      .pipe(startWith(""))
      .pipe(delay(0))
      .pipe(map(() => this.dropdowns.toArray()));

    this.filteredDropDownItems$ = combineLatest([this.dropdownItems$, this.control.valueChanges]).pipe(map(([items, value]) => {
      let itms: any[] = [];
      Object.assign(itms, items);
      return !value ? itms : itms.filter(i => (i.label.includes(value.toLowerCase()) || i.value.includes(value.toLowerCase())));

    }))
  }
  selectOption(option: TypeAheadOptionComponent) {
    this.currentSubject.next(option.label);
    this.showSubject.next(false);
    this.control?.patchValue(option.value);
  }
  onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target)) // or some similar check
      this.showSubject.next(false);
  }
  toggle() {
    this.showSubject.next(!this.showSubject.value);
  }
}
