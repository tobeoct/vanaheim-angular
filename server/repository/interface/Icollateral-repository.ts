import { Collateral } from "@entities/collateral";
import { IBaseRepository } from "./Ibase-repository";

export interface ICollateralRepository extends IBaseRepository<Collateral>{
    getByCustomerID: (customerID:number) => Promise<any[]>
}