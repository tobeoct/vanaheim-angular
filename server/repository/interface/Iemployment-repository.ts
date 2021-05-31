import { Employment } from "@models/employment";
import { IBaseRepository } from "./Ibase-repository";

export interface IEmploymentRepository extends IBaseRepository<Employment>{
    getByCustomerID: (customerID:number) => Promise<any[]>
}