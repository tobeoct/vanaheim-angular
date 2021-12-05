
import { EarningTopUp, TopUpStatus } from "@models/investment/earnings-topup";
import { SearchResponse } from "@models/search-response";
import { IEarningTopUpRepository } from "@repository/interface/investment/Iearning-topup-repository";
import { BaseRepository } from "../base-repository";


export class EarningTopUpRepository extends BaseRepository<EarningTopUp> implements IEarningTopUpRepository {

  constructor(_db: any) {
    super(_db.EarningTopUp)
  }
  getActiveTopUps= (approvedEarningID: number) => {
    return new Promise<SearchResponse<EarningTopUp[]>>(async (resolve,reject)=>{
      let response = await this._db.findAndCountAll({
        where:{approvedEarningID, status:["Pending"]},
        order: [["updatedAt", "DESC"]]
      });
      resolve(response);
    })
  }
  getByStatus= (status?:TopUpStatus) => new Promise<SearchResponse<EarningTopUp[]>>(async (resolve, reject) => {
    try {
      let where:any = {
      }

      if(status){
       where["topUpStatus"] =status
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
   
  getByApprovedEarningID = (approvedEarningID: number, amount: number) => new Promise<EarningTopUp>(async (resolve, reject) => {
    try {

      let response = await this._db.findOne({
        where: {
          approvedEarningID,
          amount
        },
        order: [["createdAt", "DESC"]]
      });
      resolve(response);
    } catch (err: any) {
      console.log(err)
      reject(err);
    }
  });


}