import { Device } from "@entities/device";
import { PushNotification } from "@entities/pushnotification";
import { Subscription } from "@entities/subscription";
import { IBaseService } from "./Ibaseservice";

export interface INotificationService extends IBaseService<any>{
    getPushNotifications : (subscriptionID:number)=>Promise<PushNotification[]>;
    sendNotification : ({userID,customerID,notification,browserID,token,pushNotification}:any)=>Promise<any>;
    registerDevice : (payload:any)=>Promise<Device>;
    subscribe : (payload:any)=>Promise<Subscription>;
    sendNotificationToMany: ({customerIds,notification,type}:any)=>Promise<any>;

}
