
import { IPushNotificationRepository } from "@repository/interface/Ipushnotification-repository";
import { PushNotification } from "@entities/pushnotification";
import { BaseRepository } from "./base-repository";

 export class PushNotificationRepository extends BaseRepository<PushNotification> implements IPushNotificationRepository{
  constructor(_db:any){
    super(_db.PushNotification)
  }
  getBySubscriptionID= (subscriptionID: number) => {
    return new Promise<any[]>(async (resolve, reject) =>{
      resolve(await this._db.findAll({
        where: {
          subscriptionID: subscriptionID
        }
      }));
    });
    
}
 }