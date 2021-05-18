import { Component, Input, OnInit } from '@angular/core';
import { Utility } from 'src/app/shared/helpers/utility.service';

@Component({
  selector: 'app-investment-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(private _utility:Utility) { }
  @Input()
  show:boolean = false;
@Input()
payout:number;

myPayout:number;
@Input()
amount:number = 0;
@Input()
min:number = 50000;
@Input()
max:number = 50000000;
@Input()
maturity:string="--";
tax:string = "--";
mgtFee:string="--";
  ngOnInit(): void {
  }

  ngOnChanges():void{
    const amount= this._utility.convertToPlainNumber(this.amount);
    if(this.payout && this.maturity!="--" && this.amount!=0 && amount>=this.min && amount<=this.max){
    const interest =+this.payout- amount;
                 this.tax ="₦ "+this._utility.currencyFormatter((interest*0.1));
                 this.mgtFee = "₦ "+this._utility.currencyFormatter(amount*0.005);
    this.myPayout = +this.payout;//this._utility.currencyFormatter(this.payout);
    }else{
      this.myPayout =0;
    }
  }

}
