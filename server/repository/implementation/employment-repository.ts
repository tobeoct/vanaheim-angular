
import { IEmploymentRepository } from "@repository/interface/Iemployment-repository";
import { Employment } from "@models/employment";
import { BaseRepository } from "./base-repository";

 export class EmploymentRepository extends BaseRepository<Employment> implements IEmploymentRepository{
  constructor(_db:any){
    super(_db.Employment)
  }
  getByCustomerID= (customerID: number) => {
    return new Promise<any[]>(async (resolve, reject) =>{
      resolve(await this._db.findAll({
        where: {
          customerID: customerID
        }
      }));
    });
    
}
 }