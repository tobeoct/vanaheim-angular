import { EarningsEmployment } from "@entities/investment/earnings-employment";
import { IEarningsEmploymentRepository } from "@repository/interface/investment/Iearnings-employment-repository";
import { BaseRepository } from "../base-repository";

 export class EarningsEmploymentRepository extends BaseRepository<EarningsEmployment> implements IEarningsEmploymentRepository{
  constructor(_db:any){
    super(_db.EarningsEmployment)
  }
  getByCustomerID= (customerID: number) => {
    return new Promise<any[]>(async (resolve, reject) =>{
      resolve(await this._db.findAll({
        where: {
          customerID
        }
      }));
    });
    
}
 }