import { InvestmentRequest } from "@models/investment/investment-request";
import { IInvestmentRequestService } from "@services/interfaces/investment/Iinvestment-request-service";
import { BaseService } from "../base-service";

export class InvestmentRequestService extends BaseService<InvestmentRequest> implements IInvestmentRequestService{
    super():any{
        
    }
 }