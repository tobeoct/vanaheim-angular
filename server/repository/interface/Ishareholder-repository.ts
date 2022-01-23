import { Shareholder } from "@entities/shareholder";
import { IBaseRepository } from "./Ibase-repository";

export interface IShareholderRepository extends IBaseRepository<Shareholder>{
    getByCompanyID: (companyID:number) => Promise<any[]>
}