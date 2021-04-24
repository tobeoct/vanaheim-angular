import { User } from "@models/user";
import { UserCategory } from "src/shared/constants/enum";
import { IBaseService } from "./Ibaseservice";

export interface IUserService extends IBaseService<User>{
  getByUserName : ( userName:string)=>Promise<User>;
   updateUserPassword: ( userName:string,pwd:string) =>Promise<User>

  resetPassword:()=>Promise<User>

  getByEmail:(email:string, category:UserCategory)=>Promise<User>
  getByPhoneNumber:(phoneNumber:string, category:UserCategory)=>Promise<User>
  getByCustomerId:(customerId:number)=>Promise<User>
  getByStaffId:(staffId:number)=>Promise<User>
  search:(parameters:object,pageNumber:number,maxSize:number)=>Promise<User>
  getAllByCategory:(category:UserCategory)=>Promise<User[]>

}
