import { EarningType } from "src/app/shared/services/earning/admin-earning.service";

export class EarningIndication{
    constructor(){

    }
    amount:number;
    type:EarningType;
    // preferredName:string;
    // emailAddress:string;
    duration:number;
    payout:number;
    rate:number;
    maturity:string;
}

export class RateDetail{
    duration:number
    maturity:string
    payout:number
    rate:number
}

// const payload = {email:$email.value, payload:{amount : myAmount, duration:duration, payout:myTotalPayout, name:$name.value,rate:investmentrate, maturity: $maturity.textContent}};
       