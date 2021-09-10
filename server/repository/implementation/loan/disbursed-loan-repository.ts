import { DisbursedLoan } from "@models/loan/disbursed-loan";
import { IDisbursedLoanRepository } from "@repository/interface/loan/Idisbursed-loan-repository";
import { BaseRepository } from "../base-repository";


export class DisbursedLoanRepository extends BaseRepository<DisbursedLoan> implements IDisbursedLoanRepository {
  constructor(_db: any) {
    super(_db.DisbursedLoan)
  }

  getByRequestID = (requestID: number) => new Promise<DisbursedLoan[]>(async (resolve, reject) => {
    try {
      let response = await this._db.findAll({
        where: {
          loanRequestID: requestID
        },
        order: [["id", "DESC"]]
      });
      // let dataValues = response?.dataValues as DisbursedLoan;
      resolve(response);
    } catch (err:any) {
      console.log(err)
      reject(err);
    }
  });
  getByRequestAndLogID = (requestID: number, loanRequestID: number) => new Promise<DisbursedLoan>(async (resolve, reject) => {
    try {
      let response = await this._db.findOne({
        where: {
          loanRequestID: requestID,
          loanRequestLogID: loanRequestID
        },
        order: [["id", "DESC"]]
      });
      let dataValues = response?.dataValues as DisbursedLoan;
      resolve(dataValues);
    } catch (err:any) {
      console.log(err)
      reject(err);
    }
  });

}