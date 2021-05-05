
import { IDeviceRepository } from "@repository/interface/Idevice-repository";
import { Device } from "@models/device";
import { BaseRepository } from "./base-repository";

 export class DeviceRepository extends BaseRepository<Device> implements IDeviceRepository{
  constructor(_db:any){
    super(_db.Device)
  }
  getByCustomerID= (customerID: number) => {
    return new Promise<any[]>(async (resolve, reject) =>{
      resolve(await this._db.findAll({
        where: {
          customerID: customerID
        }
      }));
    });
    
}
getByBrowser= (browserID: string,customerID:number) => {
  return new Promise<any>(async (resolve, reject) =>{
    resolve(await this._db.findOne({
      where: {
       browserID,
       customerID
      }
    }));
  });
  
}
 }