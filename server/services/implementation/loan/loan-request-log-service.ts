import { LoanRequestLog } from "@models/loan/loan-request-log";
import { BaseService } from "@services/interfaces/Ibaseservice";
import { ILoanRequestLogService } from "@services/interfaces/loan/Iloan-log-request-service";

export class LoanRequestLogService extends BaseService<LoanRequestLog> implements ILoanRequestLogService{
    super():any{
        
    }
 }