import { Company } from "@models/company";
import { IBaseRepository } from "./Ibase-repository";

export interface ICompanyRepository extends IBaseRepository<Company>{
    getByCustomerID: (customerID:number) => Promise<any[]>
}