import { Customer } from "@entities/customer";
import { IBaseRepository } from "./Ibase-repository";

export interface ICustomerRepository extends IBaseRepository<Customer>{
    getByUserID: (userID:number) => Promise<any>
}