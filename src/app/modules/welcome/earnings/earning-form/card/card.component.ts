import { Component, Input, OnInit } from '@angular/core';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { EarningService } from 'src/app/shared/services/earning/earning.service';

@Component({
  selector: 'app-earning-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(private _utility:Utility, private _earningService:EarningService) { }
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
                 this.tax ="₦ "+this._utility.currencyFormatter((interest*this._earningService.TAX));
                 this.mgtFee = "₦ "+this._utility.currencyFormatter(amount*this._earningService.MGT_FEE);
    this.myPayout = +this.payout;//this._utility.currencyFormatter(this.payout);
    }else{
      this.myPayout =0;
    }
  }

}
