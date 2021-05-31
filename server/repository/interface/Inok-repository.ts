import { NOK } from "@models/nok";
import { IBaseRepository } from "./Ibase-repository";

export interface INOKRepository extends IBaseRepository<NOK>{
    getByCustomerID: (customerID:number) => Promise<any>
}