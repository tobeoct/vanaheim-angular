
import { IShareholderRepository } from "@repository/interface/Ishareholder-repository";
import { Shareholder } from "@models/shareholder";
import { BaseRepository } from "./base-repository";

 export class ShareholderRepository extends BaseRepository<Shareholder> implements IShareholderRepository{
  constructor(_db:any){
    super(_db.Shareholder)
  }
  getByCompanyID= (companyID: number) => {
    return new Promise<any[]>(async (resolve, reject) =>{
      resolve(await this._db.findAll({
        where: {
          companyID: companyID
        }
      }));
    });
    
}
 }