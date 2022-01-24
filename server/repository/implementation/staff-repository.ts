
import { Staff } from "@entities/staff";
import { IStaffRepository } from "@repository/interface/Istaff-repository";
import { BaseRepository } from "./base-repository";

 export class StaffRepository extends BaseRepository<Staff> implements IStaffRepository{
  constructor(_db:any){
    super(_db.Staff)
  }
  getByUserID= (userID: number) => {
    return new Promise<any>(async (resolve, reject) =>{
      let response=await this._db.findOne({
        where: {
          userID: userID
        }
      });
      
      resolve(response);
    });
    
}
 }