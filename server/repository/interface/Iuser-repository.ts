import { UserCategory } from "@enums/usercategory";
import { User } from "@entities/user";
import { IBaseRepository } from "./Ibase-repository";

export interface IUserRepository extends IBaseRepository<User>{
    
    getByUsername: (username:string) => Promise<any>
    getByEmail: (username:string,category:UserCategory) => Promise<any>
    getByPhoneNumber: (username:string,category:UserCategory) => Promise<any>
}