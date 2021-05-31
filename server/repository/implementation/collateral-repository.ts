
import { ICollateralRepository } from "@repository/interface/Icollateral-repository";
import { Collateral } from "@models/collateral";
import { BaseRepository } from "./base-repository";

 export class CollateralRepository extends BaseRepository<Collateral> implements ICollateralRepository{
  constructor(_db:any){
    super(_db.Collateral)
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