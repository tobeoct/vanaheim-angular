import { InvestmentRequest } from "@models/investment/investment-request";
import { IInvestmentRequestRepository } from "@repository/interface/investment/Iinvestment-request-repository";
import { BaseRepository } from "../base-repository";


 export class InvestmentRequestRepository extends BaseRepository<InvestmentRequest> implements IInvestmentRequestRepository{
   super(){

   }
}