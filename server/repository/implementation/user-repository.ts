
import { IUserRepository } from "@repository/interface/Iuser-repository";
import { User } from "@models/user";
import { BaseRepository } from "./base-repository";
import { UserCategory } from "@models/helpers/enums/usercategory";

 export class UserRepository extends BaseRepository<User> implements IUserRepository{
  constructor(_db:any){
    super(_db.User)
  }
    getByUsername= (username: string) => {
     return new Promise<User>(async (resolve, reject) =>{
       resolve(await this._db.findOne({
         where: {
           username: username
         }
       }));
     });
     
   }
   getByEmail= (email: string,category:UserCategory) => {
    return new Promise<User>(async (resolve, reject) =>{
      resolve(await this._db.findOne({
        where: {
          email: email,
          category: category.toString()
        }
      }));
    });
    
  }

  getByPhoneNumber= (phoneNumber: string,category:UserCategory) => {
    return new Promise<User>(async (resolve, reject) =>{
      resolve(await this._db.findOne({
        where: {
          phoneNumber: phoneNumber,
          category: category.toString()
        }
      }));
    });
    
  }
}