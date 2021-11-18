import { EarningRequest } from "@models/investment/investment-request";
import { IEarningRequestService } from "@services/interfaces/investment/Iinvestment-request-service";
import { BaseService } from "../base-service";

export class EarningRequestService extends BaseService<EarningRequest> implements IEarningRequestService{
    convertToModel: (modelInDb: any) => Promise<EarningRequest>;
    super():any{
        
    }
 }