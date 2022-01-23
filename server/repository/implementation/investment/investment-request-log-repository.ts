import { EarningRequestStatus } from "@enums/investmentrequeststatus";
import { EarningRequestLog } from "@entities/investment/investment-request-log";
import { IEarningRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";
import { BaseRepository } from "../base-repository";


 export class EarningRequestLogRepository extends BaseRepository<EarningRequestLog> implements IEarningRequestLogRepository{
  constructor(_db: any) {
    super(_db.EarningRequestLog)
  } 
  getByCustomerID = (customerID: number) => {
    return new Promise<EarningRequestLog>(async (resolve, reject) => {
      try {
        let response = await this._db.findOne({
          where: {
            customerID: customerID
          }
        });
        let dataValues = response?.dataValues as EarningRequestLog;
        resolve(dataValues);
      } catch (err) {
        reject(err);
      }
    });
  };
  getEarningByStatus = (customerID: number, status: EarningRequestStatus|any, include?:any[]) => {

    return new Promise<EarningRequestLog[]>(async (resolve, reject) => {
      try {
        let response = await this._db.findAll({
          where: {
            customerID,
            requestStatus: status
          },
          order: [["requestDate", "DESC"]],
          include
        });
        resolve(response);
      } catch (err) {
        console.log("Earning Request Log Repository:",err)
        reject(err);
      }
    })
  }
  getByEarningRequestID = (earningRequestID: number) => {
    return new Promise<EarningRequestLog>(async (resolve, reject) => {
      try {
        let response = await this._db.findOne({
          where: {
            earningRequestID
          },
          order: [["createdAt", "DESC"]], limit: 1
        });
        let dataValues = response?.dataValues as EarningRequestLog;
        resolve(dataValues);
      } catch (err) {
        console.log(err)
        reject(err);
      }
    });
  };
}