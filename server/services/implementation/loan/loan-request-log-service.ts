import { LoanRequestLog } from "@models/loan/loan-request-log";
import { ILoanRequestLogService } from "@services/interfaces/loan/Iloan-log-request-service";
import { BaseService } from "../base-service";

export class LoanRequestLogService extends BaseService<LoanRequestLog> implements ILoanRequestLogService{
    convertToModel: (modelInDb: any) => Promise<LoanRequestLog>;
    super():any{
        
    }
 }