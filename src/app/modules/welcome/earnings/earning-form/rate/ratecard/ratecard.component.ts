import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { EarningType, EarningService } from '../../../../../../shared/services/earning/earning.service';

@Component({
    selector: 'app-ratecard',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class RatecardComponent implements OnInit, OnChanges {
    @Input() duration: number;
    rate: number;
    @Input() active: boolean = false;
    @Input() amount: number | null = 100000;
    @Input() type: string;
    @Output() rateChange = new EventEmitter();
    constructor(private _earningService:EarningService) { }

    ngOnInit(): void {
        this.rate = this._earningService.getRate(this.type as EarningType,this.amount || 0, this.duration);
        if (this.active) {
            this.rateChange.emit(this.rate.toString());
        }
    }
    ngOnChanges(): void {
        this.rate = this._earningService.getRate(this.type  as EarningType,this.amount || 0, this.duration);
        if (this.active) {
            this.rateChange.emit(this.rate.toString());
        }
    }
    
}
