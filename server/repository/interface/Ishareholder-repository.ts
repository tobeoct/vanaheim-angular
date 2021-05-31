import { Shareholder } from "@models/shareholder";
import { IBaseRepository } from "./Ibase-repository";

export interface IShareholderRepository extends IBaseRepository<Shareholder>{
    getByCompanyID: (companyID:number) => Promise<any[]>
}