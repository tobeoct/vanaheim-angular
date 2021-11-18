import { EarningRequestStatus } from "@models/helpers/enums/investmentrequeststatus";
import { EarningRequest } from "@models/investment/investment-request";
import { IEarningRequestRepository } from "@repository/interface/investment/Iinvestment-request-repository";
import { BaseRepository } from "../base-repository";


export class EarningRequestRepository extends BaseRepository<EarningRequest> implements IEarningRequestRepository {

  constructor(_db: any) {
    super(_db.EarningRequest)
  }
  getEarningByStatus = (customerID: number, status: EarningRequestStatus|any) => {

    return new Promise<EarningRequest[]>(async (resolve, reject) => {
      try {
        let response = await this._db.findAll({
          where: {
            customerID,
            requestStatus: status
          },
          order: [["requestDate", "DESC"]]
        });
        resolve(response);
      } catch (err) {
        console.log("Earning Request Repository:",err)
        reject(err);
      }
    })
  }
}