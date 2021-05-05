
import { ISubscriptionRepository } from "@repository/interface/Isubscription-repository";
import { Subscription } from "@models/subscription";
import { BaseRepository } from "./base-repository";

 export class SubscriptionRepository extends BaseRepository<Subscription> implements ISubscriptionRepository{
  constructor(_db:any){
    super(_db.Subscription)
  }
  getByDeviceID= (deviceID: number) => {
    return new Promise<any>(async (resolve, reject) =>{
      resolve(await this._db.findOne({
        where: {
          deviceID: deviceID
        }
      }));
    });
    
}
 }