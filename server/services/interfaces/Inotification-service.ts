import { Device } from "@models/device";
import { PushNotification } from "@models/pushnotification";
import { Subscription } from "@models/subscription";
import { IBaseService } from "./Ibaseservice";

export interface INotificationService extends IBaseService<any>{
    getPushNotifications : (subscriptionID:number)=>Promise<PushNotification[]>;
    sendNotification : (payload:any)=>Promise<any>;
    registerDevice : (payload:any)=>Promise<Device>;
    subscribe : (payload:any)=>Promise<Subscription>;
    sendNotificationToMany: (payload:any)=>Promise<any>;

}
