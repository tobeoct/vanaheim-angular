import { UserCategory } from "src/shared/constants/enum";
import { User } from "@models/user";
import { BaseService } from "./base-service";
import { IUserService } from "@services/interfaces/Iuser-service";
 class UserService extends BaseService<User> implements IUserService{
    constructor(){
      super(null);
    }
  getByUserName = ( userName:string):any => {
    return new Promise<User>((resolve, reject) =>{
    //    db.collection('user')
    //      .find({ 'username': userName })
    //      .toArray((err, docs) => {
    //         if(docs && docs.length>0){
    //            resolve(docs[0]);
    //         }else{
    //            reject();
    //         }
    //    });

   //  console.log(User.User.findAll())
   //   User.findAll()
   //  .then(console.log)
   //  .catch(console.error);
  var user = new User();
  user.username="user";
  user.name="Onyema";
  user.id=1;
  user.passwordHash="password";
  user.category=UserCategory.customer;
    if(userName!="user") user.category = UserCategory.admin;
    resolve(user);
    });
 }
   updateUserPassword = ( userName:string,pwd:string) => {
    return new Promise<User>((resolve, reject) =>{});
//    return db.collection('user').updateOne({'username': userName }, {
//      $set: {password:pwd} 
//    })
//    .then((r) => {
//      return Promise.resolve(r.matchedCount);
//    })
//    .catch((err) => {
//      return Promise.reject(err);
//    })
 }

  resetPassword=()=>{
   return new Promise<User>((resolve, reject) =>{});
 }

  getByEmail=(email:string, category:UserCategory)=>{
   return new Promise<User>((resolve, reject) =>{});
 }
  getByPhoneNumber=(phoneNumber:string, category:UserCategory)=>{
   return new Promise<User>((resolve, reject) =>{});
 }
  getByCustomerId=(customerId:number)=>{
   return new Promise<User>((resolve, reject) =>{});
 }
  getByStaffId=(staffId:number)=>{
   return new Promise<User>((resolve, reject) =>{});
 }
  search=(parameters:object,pageNumber:number,maxSize:number)=>{
   return new Promise<User>((resolve, reject) =>{});
 }
  getAllByCategory=(category:UserCategory)=>{
   return new Promise<User[]>((resolve, reject) =>{});
 }
}


export default UserService