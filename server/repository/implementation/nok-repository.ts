
import { INOKRepository } from "@repository/interface/Inok-repository";
import { NOK } from "@models/nok";
import { BaseRepository } from "./base-repository";

 export class NOKRepository extends BaseRepository<NOK> implements INOKRepository{
  constructor(_db:any){
    super(_db.NOK)
  }
  getByCustomerID= (customerID: number) => {
    return new Promise<any>(async (resolve, reject) =>{
      resolve(await this._db.findOne({
        where: {
          customerID: customerID
        }
      }));
    });
    
}
 }