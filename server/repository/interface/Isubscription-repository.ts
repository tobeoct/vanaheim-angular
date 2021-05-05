import { Subscription } from "@models/subscription";
import { IBaseRepository } from "./Ibase-repository";

export interface ISubscriptionRepository extends IBaseRepository<Subscription>{
    getByDeviceID: (deviceID:number) => Promise<any>
}