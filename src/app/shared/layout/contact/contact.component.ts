import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
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
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  emailSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  email$: Observable<string> = this.emailSubject.asObservable();

  constructor(private _eref: ElementRef, private _router: Router) {
    _router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url.includes("loans")) {
          this.emailSubject.next("loans@vanircapital.org");
        } else if (event.url.includes("earnings")) {
          this.emailSubject.next("earnings@vanircapital.org")
        } else {
          this.emailSubject.next("")
        }
      }
    });
  }

  ngOnInit(): void {
    }
  toggleShow = () => {
        this.showSubject.next(!this.showSubject.value);
      }
  onClick(event: any) {
      if(!this._eref.nativeElement.contains(event.target)) // or some similar check
    this.showSubject.next(false);
  }
}
