import { EarningRequestStatus } from "@models/helpers/enums/investmentrequeststatus";
import { EarningRequest } from "@models/investment/investment-request";
import { IBaseRepository } from "../Ibase-repository";

export interface IEarningRequestRepository extends IBaseRepository<EarningRequest>{
    getEarningByStatus:(customerID:number, status:EarningRequestStatus|any, include?:any[])=>Promise<EarningRequest[]>;
    getByCustomerID:(customerID:number)=>Promise<EarningRequest>;
}