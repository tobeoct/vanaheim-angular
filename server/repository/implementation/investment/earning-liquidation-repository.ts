import { EarningLiquidation } from "@entities/investment/earnings-liquidation";
import { LiquidationStatus } from "@enums/liquidationStatus";
import { SearchResponse } from "@models/search-response";
import { IEarningLiquidationRepository } from "@repository/interface/investment/Iearning-liquidation-repository";
import { BaseRepository } from "../base-repository";


 export class EarningLiquidationRepository extends BaseRepository<EarningLiquidation> implements IEarningLiquidationRepository{
 
     constructor(_db: any) {
       super(_db.EarningLiquidation)
     }
     getByStatus= (status?:LiquidationStatus,include?:any[]) => new Promise<SearchResponse<EarningLiquidation[]>>(async (resolve, reject) => {
      try {
        let where:any = {
        }
  
        if(status){
         where["liquidationStatus"] =status
        }
        let response = await this._db.findAndCountAll({
          where,
          order: [["updatedAt", "DESC"]],
          include
        });
        resolve(response);
      } catch (err:any) {
        console.log(err)
        reject(err);
      }
    });
     
    getByApprovedEarningID = (approvedEarningID: number,include?:any[]) => new Promise<EarningLiquidation>(async (resolve, reject) => {
      try {
  
        let response = await this._db.findOne({
          where: {
            approvedEarningID
          },
          order: [["createdAt", "DESC"]],
          include
        });
        resolve(response);
      } catch (err: any) {
        console.log(err)
        reject(err);
      }
    });
  
   
}