import { IAccountRepository } from "@repository/interface/Iaccount-repository";
import { Account } from "@models/account";
import { BaseRepository } from "./base-repository";


 export class AccountRepository extends BaseRepository<Account> implements IAccountRepository{
  constructor(_db:any){
    super(_db.Account)
  }
  getByCustomerID= (customerID: number) => {
    return new Promise<any[]>(async (resolve, reject) =>{
      resolve(await this._db.findAll({
        where: {
          customerID: customerID
        }
      }));
    });
    
}
}
