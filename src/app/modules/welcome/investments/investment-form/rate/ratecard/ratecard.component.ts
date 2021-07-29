import { Component, Input, OnChanges, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ratecard',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class RatecardComponent implements OnInit,OnChanges {
  @Input() duration:number;
  rate:number;
  @Input() active:boolean=false;
  @Input() amount:number|null=100000;
  @Output() rateChange = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    this.rate  = this.getRate(this.amount||0,this.duration);
    if(this.active){
        this.rateChange.emit(this.rate.toString());
        }
  }
  ngOnChanges():void{
    this.rate  = this.getRate(this.amount||0,this.duration);
    if(this.active){
    this.rateChange.emit(this.rate.toString());
    }
  }
  getRate(amount:number,duration:number){
    let r = 0;
   
    switch(duration){
        case 3: 
            if(amount>=100000&&amount<=10000000){
                r = 16;
            }else if(amount>10000000&&amount<=20000000){
                r=18;
            }
            break;
        case 6: 
            if(amount>=100000&&amount<=10000000){
                r = 18;
            }else if(amount>10000000&&amount<=20000000){
                r=20;
            }
            // else if (amount>20000000){
            //     r=22;
            // }
        break;
        case 9: 
            if(amount>=100000&&amount<=10000000){
                r = 19;
            }else if(amount>10000000&&amount<=20000000){
                r=20;
            }
            // else if (amount>20000000){
            //     r=23;
            // }
        break;
        case 12: 
            if(amount>=100000&&amount<=10000000){
                r = 20;
            }else if(amount>10000000&&amount<=20000000){
                r=20;
            }
            
            // else if (amount>20000000){
            //     r=24;
            // }
        break;
    }
    return r;


  }
}
