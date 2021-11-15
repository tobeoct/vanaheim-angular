import { BaseEntity } from "./base-entity";
import { Device } from "./device";
import { PushNotification } from "./pushnotification";

export class Subscription extends BaseEntity{
    token:string;
    device:Device;
    deviceID:number;
    isExpired:boolean;
    pushNotifications: PushNotification[];
}