import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class ContactComponent implements OnInit {
  showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$:Observable<boolean> = this.showSubject.asObservable();
  constructor(private _eref: ElementRef) { }

  ngOnInit(): void {
  }
toggleShow=()=>{
  this.showSubject.next(!this.showSubject.value);
}
onClick(event:any) {
  if (!this._eref.nativeElement.contains(event.target)) // or some similar check
  this.showSubject.next(false);
 }
}
