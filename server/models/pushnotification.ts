import { BaseEntity } from "./base-entity";
import { Device } from "./device";
import { Subscription } from "./subscription";

export class PushNotification extends BaseEntity{
    title:string;
    body:string;
    photo:string;
    url:string;
    subscriptionID:number;
    subscription:Subscription;
    isSent:boolean;
}