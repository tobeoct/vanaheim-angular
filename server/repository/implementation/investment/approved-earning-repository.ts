import { ApprovedEarning } from "@models/investment/approved-investment";
import { IApprovedEarningRepository } from "@repository/interface/investment/Iapproved-earning-repository";
import { BaseRepository } from "../base-repository";



export class ApprovedEarningRepository extends BaseRepository<ApprovedEarning> implements IApprovedEarningRepository {
  constructor(_db: any) {
    super(_db.ApprovedEarning)
  }

  getByRequestID = (requestID: number) => new Promise<ApprovedEarning[]>(async (resolve, reject) => {
    try {
      let response = await this._db.findAll({
        where: {
          earningRequestID: requestID
        },
        order: [["id", "DESC"]]
      });
      // let dataValues = response?.dataValues as ApprovedEarning;
      resolve(response);
    } catch (err:any) {
      console.log(err)
      reject(err);
    }
  });
  getByRequestAndLogID = (requestID: number, earningRequestID: number) => new Promise<ApprovedEarning>(async (resolve, reject) => {
    try {
      let response = await this._db.findOne({
        where: {
          earningRequestID: requestID,
          earningRequestLogID: earningRequestID
        },
        order: [["id", "DESC"]]
      });
      // let dataValues = response?.dataValues as ApprovedEarning;
      resolve(response);
    } catch (err:any) {
      console.log(err)
      reject(err);
    }
  });

}