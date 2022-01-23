import { IRepaymentRepository } from "@repository/interface/Irepayment-repository";
import { Repayment } from "@entities/loan/repayment";
import { BaseRepository } from "./base-repository";


 export class RepaymentRepository extends BaseRepository<Repayment> implements IRepaymentRepository{
 
     constructor(_db: any) {
       super(_db.Repayment)
     }
   getByDisbursedLoanID= (disbursedLoanID: number) => new Promise<Repayment[]>(async (resolve, reject) => {
    try {
      let response = await this._db.findAll({
        where: {
          disbursedLoanID: disbursedLoanID
        },
        order: [["dateRepaid", "ASC"]]
      });
      // let dataValues = response?.dataValues as DisbursedLoan;
      resolve(response);
    } catch (err:any) {
      console.log(err)
      reject(err);
    }
  });
   
   
}