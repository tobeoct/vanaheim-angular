import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EarningsStore, Store } from 'src/app/shared/helpers/store';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

  const data =  [
    { visited: true, key: "earnings-calculator", title: "Earnings Details", id: "earnings-calculator", url: "earnings-calculator" },
    { visited: false, key: "personalInfo", title: "Personal", id: "personal-info", url: "personal-info" },
    { visited: false, key: "accountInfo", title: "Account", id: "account-info", url: "account-info" },
    { visited: false, key: "employmentInfo", title: "Employment", id: "employment-info", url: "employment-info" },
    { visited: false, key: "nokInfo", title: "Next Of Kin", id: "nok-info", url: "nok-info" },
    { visited: false, key: "meansOfIdentification", title: "Identification", id: "means-of-identification", url: "means-of-identification" },
    { visited: false, key: "preview", title: "Preview", id: "preview", url: "preview" },
    { visited: false, key: "login", title: "Login", id: "login", url: "login" }, //Login is expected to be the last child as css for nav items makes last child invisible during login

  ]

@Component({
  selector: 'app-earnings-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy {


  logoutSub: Subscription;
  theme: string;
  allSubscriptions: Subscription[] = [];
  active$: Observable<string>;
  isLoggedIn$: Observable<boolean>;
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(data);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  constructor(private _router: Router, private _utility: Utility, private _store: EarningsStore, private _route: ActivatedRoute, private _authService: AuthService) {
    this.toggleNav(this._router.url);
    this.active$ = this._utility.activeSolution$;
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.toggleNav(x.url);
    });
  }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleNav(url: string) {
   
      this.showSubject.next(true);
    
  }
  ngOnInit(): void {
    this._authService.isLoggedIn();
    this.isLoggedIn$ = this._authService.isLoggedInSubject.asObservable()
   let sub = this._store.earningsApplicationSubject.asObservable().subscribe((application: any) => {
      let earnings = application as any;

      let navigation = this.dataSelectionSubject.value;
      navigation.map((nav: any, i: number) => {
        if (earnings[nav.key] && nav.key!=='login') {
          nav.visited = true;

          if (i < navigation.length) {
            if (navigation[i + 1]) {
              navigation[i + 1].visited = true;
              if (navigation[i + 1].key == "meansOfIdentification" || navigation[i + 1].key == "preview") {
                navigation[i + 1].visited = true;

              }
            }

          }
        }
        return nav;
      })
      this.dataSelectionSubject.next(navigation)
    })
    this.allSubscriptions.push(sub);
  }



  onNavigate(route: string) {
    this._router.navigate([route], { relativeTo: this._route })
  }


  trackByFn(index: any, item: any) {
    return index; // or item.id
  }


}
