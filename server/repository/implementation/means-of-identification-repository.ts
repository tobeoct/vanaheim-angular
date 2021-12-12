
import { IMeansOfIdentificationRepository } from "@repository/interface/Imeans-of-identification-repository";
import { MeansOfIdentification } from "@models/investment/means-of-identification";
import { BaseRepository } from "./base-repository";

 export class MeansOfIdentificationRepository extends BaseRepository<MeansOfIdentification> implements IMeansOfIdentificationRepository{
  constructor(_db:any){
    super(_db.MeansOfIdentification)
  }
  getByDocumentID= (documentID: number) => {
    return new Promise<any>(async (resolve, reject) =>{
      resolve(await this._db.findOne({
        where: {
          documentID
        }
      }));
    });
    
}
 }