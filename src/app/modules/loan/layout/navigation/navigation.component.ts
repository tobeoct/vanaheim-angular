import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { BaseLoanApplication } from '../../loan-application';
const data: any = {
  business: [{ visited: true, key: "loanCalculator", title: "Loan Details", id: "loan-calculator", url: "loan-calculator" },
  { visited: false, key: "additionalInfo", title: "Contact", id: "contact-info", url: "contact-info" },
  { visited: false, key: "companyInfo", title: "Company", id: "company-info", url: "company-info" },
  { visited: false, key: "shareholderInfo", title: "Shareholder", id: "shareholder-info", url: "shareholder-info" },
  { visited: false, key: "collateralInfo", title: "Collateral", id: "collateral-info", url: "collateral-info" },
  { visited: false, key: "accountInfo", title: "Account", id: "account-info", url: "account-info" },
  { visited: false, key: "documents", title: "Documents", id: "upload", url: "upload" },
  { visited: false, key: "preview", title: "Preview", id: "preview", url: "preview" },
  { title: "Login", id: "login", url: "/auth/account" }],
  personal: [
    { visited: true, key: "loanCalculator", title: "Loan Details", id: "loan-calculator", url: "loan-calculator" },
    { visited: false, key: "bvn", title: "BVN", id: "bvn-info", url: "bvn-info" },
    { visited: false, key: "personalInfo", title: "Personal", id: "personal-info", url: "personal-info" },
    { visited: false, key: "accountInfo", title: "Account", id: "account-info", url: "account-info" },
    { visited: false, key: "employmentInfo", title: "Employment", id: "employment-info", url: "employment-info" },
    { visited: false, key: "nokInfo", title: "Next Of Kin", id: "nok-info", url: "nok-info" },
    { visited: false, key: "documents", title: "Documents", id: "upload", url: "upload" },
    { visited: false, key: "preview", title: "Preview", id: "preview", url: "preview" },
    { title: "Login", id: "login", url: "/auth/account" },

  ]
}
@Component({
  selector: 'app-loan-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy {


  logoutSub: Subscription;
  theme: string;
  allSubscriptions: Subscription[] = [];
  active$: Observable<string>;
  isLoggedIn: boolean = false;
  dataSelectionSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataSelection$: Observable<any[]> = this.dataSelectionSubject.asObservable();
  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  constructor(private _router: Router, private _utility: Utility, private _store: Store, private _route: ActivatedRoute, private _authService: AuthService) {
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
    if (url.includes("loan-type") || url.includes("applying-as") || url.includes("loan-product")) {
      this.showSubject.next(false);
    } else {
      this.showSubject.next(true);
    }
  }
  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
    let sub = this._store.loanCategory$.subscribe((c: string) => {
      if (data[c]) {
        let links = data[c].filter((d: any) => {
          if (c == "personal") return true;
          if (this.isLoggedIn && c == "business" && d.title == "Additional") return false;
          return true;
        })
        this.dataSelectionSubject.next(links)
      }
    });
    this._store.loanApplication$.subscribe((application: any) => {
      let loan = application[this._store.loanCategory] as any
      console.log(loan)

      let navigation = this.dataSelectionSubject.value;
      navigation.map((nav: any, i: number) => {
        if (loan[nav.key]) {
          nav.visited = true;

          if (i < navigation.length) {
            if (navigation[i + 1]) {
              navigation[i + 1].visited = true;
              if (navigation[i + 1].key == "documents" || navigation[i + 1].key == "preview") {
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

  ngOnChanges(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
  }

  onNavigate(route: string) {
    this._router.navigate([route], { relativeTo: this._route })
  }


  trackByFn(index: any, item: any) {
    return index; // or item.id
  }


}
