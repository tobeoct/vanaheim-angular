import { IAccountRepository } from "@repository/interface/Iaccount-repository";
import { Account } from "@models/account";
import { BaseRepository } from "./base-repository";


 export class AccountRepository extends BaseRepository<Account> implements IAccountRepository{
   super(){

   }
}