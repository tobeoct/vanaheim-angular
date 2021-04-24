
import { IUserRepository } from "@repository/interface/Iuser-repository";
import { User } from "@models/user";
import { BaseRepository } from "./base-repository";


 export class UserRepository extends BaseRepository<User> implements IUserRepository{
   super(){

   }
}