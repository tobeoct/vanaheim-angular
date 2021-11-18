import { EarningRequestLog } from "@models/investment/investment-request-log";
import { IEarningRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";
import { BaseRepository } from "../base-repository";


 export class EarningRequestLogRepository extends BaseRepository<EarningRequestLog> implements IEarningRequestLogRepository{
   super(){

   }
}