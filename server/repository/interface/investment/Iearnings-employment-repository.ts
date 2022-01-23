
import { EarningsEmployment } from "@entities/investment/earnings-employment";
import { IBaseRepository } from "../Ibase-repository";

export interface IEarningsEmploymentRepository extends IBaseRepository<EarningsEmployment>{
    getByCustomerID: (customerID:number) => Promise<any[]>
}