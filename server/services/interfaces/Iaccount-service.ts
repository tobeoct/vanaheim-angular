import { Account } from "@models/account";
import { IBaseService } from "./Ibaseservice";

export type AccountInfo={
   id?:number
   bank:string
   accountNumber:string
   accountName:string
}
export interface IAccountService extends IBaseService<any>{
   createAccount:(customerID:number,accountInfo:AccountInfo)=>Promise<Account>;
}
