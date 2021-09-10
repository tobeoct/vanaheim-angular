import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from 'src/app/shared/helpers/store';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-loan-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class LoanHeaderComponent implements OnInit, OnChanges {
  title$: Observable<string>;
  loanType$: Observable<string>;
  loanProduct$: Observable<string>;
  applyingAs$: Observable<string>;
  isLoggedIn: boolean;
  base = "welcome/loans/apply/";
  constructor(private _store: Store, private _router: Router, private _route: ActivatedRoute, private _location: Location, private _authService: AuthService) {
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.base = x.url.replace(/\/[^\/]*$/, '/');
    });
  }

  ngOnInit(): void {
    this.title$ = this._store.title$;
    this.applyingAs$ = this._store.applyingAs$;
    this.loanProduct$ = this._store.loanProduct$;
    this.loanType$ = this._store.loanType$;
    this.isLoggedIn = this._authService.isLoggedIn();
  }

  ngOnChanges() {
    this.isLoggedIn = this._authService.isLoggedIn();
  }

  back = () => {

    this._store.back();

    if (this._router.url != "/welcome/loans") {
      this._location.back();
      // this.onNavigate(this._store.previousSubject.value);
    }
  }
  onNavigate(route: string, params: any = {}): void {
    if (this.base == "/welcome/") this.base = "/welcome/loans/apply/"
    const r = this.base + route;
    this._router.navigate([r], { queryParams: params })
    this._store.setPage(route)
  }
}
