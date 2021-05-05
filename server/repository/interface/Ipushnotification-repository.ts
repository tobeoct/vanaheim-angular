import { PushNotification } from "@models/pushnotification";
import { IBaseRepository } from "./Ibase-repository";

export interface IPushNotificationRepository extends IBaseRepository<PushNotification>{
    getBySubscriptionID: (subscriptionID:number) => Promise<any[]>
}