
import { EarningTopUp } from "@entities/investment/earnings-topup";
import { TopUpStatus } from "@enums/topUpStatus";
import { SearchResponse } from "@models/search-response";
import { IEarningTopUpRepository } from "@repository/interface/investment/Iearning-topup-repository";
import { BaseRepository } from "../base-repository";


export class EarningTopUpRepository extends BaseRepository<EarningTopUp> implements IEarningTopUpRepository {

  constructor(_db: any) {
    super(_db.EarningTopUp)
  }
  getActiveTopUps = (approvedEarningID: number, include?: any[]) => {
    return new Promise<SearchResponse<EarningTopUp[]>>(async (resolve, reject) => {
      let response = await this._db.findAndCountAll({
        where: { approvedEarningID, status: ["Pending"] },
        order: [["updatedAt", "DESC"]],
        include
      });
      resolve(response);
    })
  }
  getByStatus = (status?: TopUpStatus, include?: any[]) => new Promise<SearchResponse<EarningTopUp[]>>(async (resolve, reject) => {
    try {
      let where: any = {
      }

      if (status) {
        where["topUpStatus"] = status
      }
      let response = await this._db.findAndCountAll({
        where,
        order: [["updatedAt", "DESC"]],
        include
      });
      resolve(response);
    } catch (err: any) {
      console.log(err)
      reject(err);
    }
  });

  getByApprovedEarningID = (approvedEarningID: number, amount: number, pageNumber: number, maxSize: number, include?: any[]) => new Promise<EarningTopUp>(async (resolve, reject) => {
    try {

      let response = await this._db.findOne({
        where: {
          approvedEarningID,
          amount
        }, limit: maxSize,
        offset: pageNumber * maxSize,
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