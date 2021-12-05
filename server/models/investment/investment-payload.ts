import { EarningType } from "@models/helpers/enums/earningtype";
import { AccountInfo } from "@services/interfaces/Iaccount-service";

export type EarningPayload ={
    name?:string
    email?:string
    taxId?:string
    payout:string
    duration:number
    rate:number
    maturity:string
    amount:string
    type:EarningType;
    accountInfo:AccountInfo
}