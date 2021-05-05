import { LoanRequest } from "@models/loan/loan-request";
import { ILoanRequestService } from "@services/interfaces/loan/Iloan-request-service";
import { BaseService } from "../base-service";

export class LoanRequestService extends BaseService<LoanRequest> implements ILoanRequestService{
    convertToModel: (modelInDb: any) => Promise<LoanRequest>;
    super():any{
        
    }
 }