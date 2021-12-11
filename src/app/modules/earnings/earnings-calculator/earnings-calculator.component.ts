import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EarningsStore } from 'src/app/shared/helpers/store';

@Component({
  selector: 'app-earnings-calculator',
  templateUrl: './earnings-calculator.component.html',
  styleUrls: ['./earnings-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EarningsCalculatorComponent implements OnInit {
  constructor(private _router: Router, private _earningStore:EarningsStore) {
    
  }

  ngOnInit(): void {
    this._earningStore.titleSubject.next("Earnings Calculator");
 
  }
  login(): void {
    this._router.navigate(["auth/login"])
  }
}
