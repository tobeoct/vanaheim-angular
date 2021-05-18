import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.scss']
})
export class LoanSummaryComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit(): void {
  }
  onNavigate(route:string,params:any={}):void{
    this._router.navigate([route],{queryParams: params})
  }
}
