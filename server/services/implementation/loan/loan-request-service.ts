import { LoanRequest } from "@models/loan/loan-request";
import { BaseService } from "@services/interfaces/Ibaseservice";
import { ILoanRequestService } from "@services/interfaces/loan/Iloan-request-service";

export class LoanRequestService extends BaseService<LoanRequest> implements ILoanRequestService{
    super():any{
        
    }
 }