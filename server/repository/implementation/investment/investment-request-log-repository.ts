import { InvestmentRequestLog } from "@models/investment/investment-request-log";
import { IInvestmentRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";
import { BaseRepository } from "../base-repository";


 export class InvestmentRequestLogRepository extends BaseRepository<InvestmentRequestLog> implements IInvestmentRequestLogRepository{
   super(){

   }
}