
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { Customer } from "@models/customer";
import { BaseRepository } from "./base-repository";

 export class CustomerRepository extends BaseRepository<Customer> implements ICustomerRepository{
  constructor(_db:any){
    super(_db.Customer)
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