import { Device } from "@models/device";
import { PushNotification } from "@models/pushnotification";
import { Subscription } from "@models/subscription";
import { IBaseService } from "./Ibaseservice";

export interface INotificationService extends IBaseService<any>{
    getPushNotifications : (subscriptionID:number)=>Promise<PushNotification[]>;
    sendNotification : ({userID,notification,browserID,token,pushNotification}:any)=>Promise<any>;
    registerDevice : (payload:any)=>Promise<Device>;
    subscribe : (payload:any)=>Promise<Subscription>;
    sendNotificationToMany: ({customerIds,notification,type}:any)=>Promise<any>;

}
