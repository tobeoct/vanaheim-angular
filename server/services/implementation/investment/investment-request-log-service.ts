import { InvestmentRequestLog } from "@models/investment/investment-request-log";
import { IInvestmentRequestLogService } from "@services/interfaces/investment/Iinvestment-log-request-service";
import { BaseService } from "../base-service";

export class InvestmentRequestLogService extends BaseService<InvestmentRequestLog> implements IInvestmentRequestLogService{
    super():any{
        
    }
 }