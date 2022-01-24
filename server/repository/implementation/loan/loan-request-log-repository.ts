import { LoanRequestLog } from "@entities/loan/loan-request-log";
import { ILoanRequestLogRepository } from "@repository/interface/loan/Iloan-request-log-repository";
import { BaseRepository } from "../base-repository";


export class LoanRequestLogRepository extends BaseRepository<LoanRequestLog> implements ILoanRequestLogRepository {
  constructor(_db: any) {
    super(_db.LoanRequestLog)
  }
  getByCustomerID = (customerID: number) => {
    return new Promise<LoanRequestLog>(async (resolve, reject) => {
      try {
        let response = await this._db.findOne({
          where: {
            customerID: customerID
          }
        });
        let dataValues = response?.dataValues as LoanRequestLog;
        resolve(dataValues);
      } catch (err) {
        reject(err);
      }
    });
  };

  getByLoanRequestID = (loanRequestID: number) => {
    return new Promise<LoanRequestLog>(async (resolve, reject) => {
      try {
        let response = await this._db.findOne({
          where: {
            loanRequestID
          },
          order: [["createdAt", "DESC"]], limit: 1
        });
        let dataValues = response?.dataValues as LoanRequestLog;
        resolve(dataValues);
      } catch (err) {
        console.log(err)
        reject(err);
      }
    });
  };
}