import { Device } from "@models/device";
import { IBaseRepository } from "./Ibase-repository";

export interface IDeviceRepository extends IBaseRepository<Device>{
    getByCustomerID: (customerID:number) => Promise<any[]>
    getByBrowser: (browserID:string,customerID:number) => Promise<any>
}