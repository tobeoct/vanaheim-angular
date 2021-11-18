import { EarningRequestLog } from "@models/investment/investment-request-log";
import { IEarningRequestLogService } from "@services/interfaces/investment/Iinvestment-log-request-service";
import { BaseService } from "../base-service";

export class EarningRequestLogService extends BaseService<EarningRequestLog> implements IEarningRequestLogService{
    convertToModel: (modelInDb: any) => Promise<EarningRequestLog>;
    super():any{
        
    }
 }