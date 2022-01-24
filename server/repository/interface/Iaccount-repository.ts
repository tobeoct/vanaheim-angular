import { Account } from "@entities/account";
import { IBaseRepository } from "./Ibase-repository";

export interface IAccountRepository extends IBaseRepository<Account>{
    getByCustomerID: (customerID:number) => Promise<any[]>
}