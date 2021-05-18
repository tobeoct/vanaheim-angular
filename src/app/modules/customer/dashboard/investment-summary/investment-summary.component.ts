import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-investment-summary',
  templateUrl: './investment-summary.component.html',
  styleUrls: ['./investment-summary.component.scss']
})
export class InvestmentSummaryComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit(): void {
  }
  onNavigate(route:string,params:any={}):void{
    this._router.navigate([route],{queryParams: params})
  }

}
