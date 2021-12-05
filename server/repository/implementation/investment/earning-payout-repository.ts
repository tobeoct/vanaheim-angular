import { EarningPayout } from "@models/investment/investment-payout";
import { IEarningPayoutRepository } from "@repository/interface/investment/Iearning-payout-repository";
import sequelize from "sequelize/types/lib/sequelize";
import { BaseRepository } from "../base-repository";


 export class EarningPayoutRepository extends BaseRepository<EarningPayout> implements IEarningPayoutRepository{
 
     constructor(_db: any) {
       super(_db.EarningPayout)
     }
   getByApprovedEarningID= (approvedEarningID: number) => new Promise<EarningPayout[]>(async (resolve, reject) => {
    try {
      let response = await this._db.findAll({
        where: {
          approvedEarningID
        },
        order: [["datePaid", "ASC"]]
      });
      resolve(response);
    } catch (err:any) {
      console.log(err)
      reject(err);
    }
  });
  getPayoutSoFar= (approvedEarningID: number) => new Promise<any[]>(async (resolve, reject) => {
    try {
      let response = await this._db.findAll({
        where: {
          approvedEarningID
        },
        attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']],
        raw:true
      });
      resolve(response);
    } catch (err:any) {
      console.log(err)
      reject(err);
    }
  });
   
}