
import { ICollateralRepository } from "@repository/interface/Icollateral-repository";
import { Collateral } from "@entities/collateral";
import { BaseRepository } from "./base-repository";

export class CollateralRepository extends BaseRepository<Collateral> implements ICollateralRepository {
  constructor(_db: any) {
    super(_db.Collateral)
  }
  getByCustomerID = (customerID: number, include?: any[]) => {
    return new Promise<any[]>(async (resolve, reject) => {
      resolve(await this._db.findAll({
        where: {
          customerID: customerID
        },
        include
      }));
    });

  }
}