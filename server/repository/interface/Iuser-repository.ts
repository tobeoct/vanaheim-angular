import { UserCategory } from "@models/helpers/enums/usercategory";
import { User } from "@models/user";
import { IBaseRepository } from "./Ibase-repository";

export interface IUserRepository extends IBaseRepository<User>{
    
    getByUsername: (username:string) => Promise<any>
    getByEmail: (username:string,category:UserCategory) => Promise<any>
    getByPhoneNumber: (username:string,category:UserCategory) => Promise<any>
}