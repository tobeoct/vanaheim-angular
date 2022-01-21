
import { EarningsEmployment } from "@models/investment/earnings-employment";
import { IBaseRepository } from "../Ibase-repository";

export interface IEarningsEmploymentRepository extends IBaseRepository<EarningsEmployment>{
    getByCustomerID: (customerID:number) => Promise<any[]>
}