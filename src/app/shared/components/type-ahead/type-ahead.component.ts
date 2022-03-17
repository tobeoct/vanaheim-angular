import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TypeAheadOptionComponent } from './option/option.component';

@Component({
  selector: 'app-type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class TypeAheadComponent implements OnInit {

  constructor(private _eref: ElementRef) { }
  basePath = "../../../../assets/illustrations/characters";
  @Input()
  class: string = '';
  @Input()
  fieldClass: string = '';
  @Input()
  placeholder: string = '- select -';
  @Input()
  control: FormControl = new FormControl('');
  @Input()
  id: string = '';
  @Input()
  current: string = '';

  @Input()
  items$: Observable<any[]>;

  currentControl = new FormControl('');

  currentSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  filteredItemsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  filteredItems$: Observable<any[]>=this.filteredItemsSubject.asObservable()
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  ngOnInit(): void {

    this.currentControl.valueChanges.subscribe(v=>{
      this.currentSubject.next(v);
    })
     combineLatest([this.items$, this.currentSubject.asObservable()]).pipe(map(([items, value]) => {
      let itms: any[] = [];
      Object.assign(itms, items);
      return !value ? itms : itms.filter(i => (i.value.toString()?.toLowerCase().includes(value.toLowerCase())));

    }), tap(c=>this.filteredItemsSubject.next(c))).subscribe()
  }
  selectOption(option: any) {
    // this.currentSubject.next(option.value);
    this.showSubject.next(false);
    this.control.patchValue(option.key);
  }
  onClick(event: any) {
    
    if (!this._eref.nativeElement.contains(event.target))this.showSubject.next(false);
  }
  toggle() {
    this.showSubject.next(!this.showSubject.value);
  }
  show() {
    this.showSubject.next(true);
  }
}
