import { EarningLiquidation, LiquidationStatus } from "@models/investment/earnings-liquidation";
import { SearchResponse } from "@models/search-response";
import { IEarningLiquidationRepository } from "@repository/interface/investment/Iearning-liquidation-repository";
import { BaseRepository } from "../base-repository";


 export class EarningLiquidationRepository extends BaseRepository<EarningLiquidation> implements IEarningLiquidationRepository{
 
     constructor(_db: any) {
       super(_db.EarningLiquidation)
     }
     getByStatus= (status?:LiquidationStatus) => new Promise<SearchResponse<EarningLiquidation[]>>(async (resolve, reject) => {
      try {
        let where:any = {
        }
  
        if(status){
         where["liquidationStatus"] =status
        }
        let response = await this._db.findAndCountAll({
          where,
          order: [["updatedAt", "DESC"]]
        });
        resolve(response);
      } catch (err:any) {
        console.log(err)
        reject(err);
      }
    });
     
    getByApprovedEarningID = (approvedEarningID: number) => new Promise<EarningLiquidation>(async (resolve, reject) => {
      try {
  
        let response = await this._db.findOne({
          where: {
            approvedEarningID
          },
          order: [["dateCreated", "DESC"]]
        });
        resolve(response);
      } catch (err: any) {
        console.log(err)
        reject(err);
      }
    });
  
   
}