import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {

  constructor() { }
  @Input()
  data$:Observable<any>;
  @Output()
  filterChange = new EventEmitter<string>();

  activeFilterSubject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeFilter$:Observable<string> = this.activeFilterSubject.asObservable();


  ngOnInit(): void {
    // this.data$.subscribe(console.log)
  }
  changeFilter(value:string){
    this.filterChange.next(value);
    this.activate(value);
  }

  activate(value:string){
    this.activeFilterSubject.next(value);
  }

  trackByFn(index:any,item:any){
    return index;
  }
}
