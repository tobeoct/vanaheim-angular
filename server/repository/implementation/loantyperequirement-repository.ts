
import { ILoanTypeRequirementRepository } from "@repository/interface/Iloantyperequirement-repository";
import { LoanTypeRequirements } from "@entities/loan/loan-type-requirements";
import { BaseRepository } from "./base-repository";

 export class LoanTypeRequirementRepository extends BaseRepository<LoanTypeRequirements> implements ILoanTypeRequirementRepository{
  constructor(_db:any){
    super(_db.LoanTypeRequirement)
  }
  getByLoanRequestLogID= (requestLogID: number) => {
    return new Promise<any[]>(async (resolve, reject) =>{
      resolve(await this._db.findAll({
        where: {
          loanRequestLogID: requestLogID
        }
      }));
    });
    
}
 }