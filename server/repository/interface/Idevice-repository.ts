import { Device } from "@entities/device";
import { IBaseRepository } from "./Ibase-repository";

export interface IDeviceRepository extends IBaseRepository<Device>{
    getByCustomerID: (customerID:number) => Promise<any[]>
    getByBrowser: (browserID:string,customerID:number) => Promise<any>
}