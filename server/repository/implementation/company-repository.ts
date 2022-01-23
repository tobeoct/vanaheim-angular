
import { ICompanyRepository } from "@repository/interface/Icompany-repository";
import { Company } from "@entities/company";
import { BaseRepository } from "./base-repository";

 export class CompanyRepository extends BaseRepository<Company> implements ICompanyRepository{
  constructor(_db:any){
    super(_db.Company)
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