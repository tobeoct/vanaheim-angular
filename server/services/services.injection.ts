import { LoanRequest } from "@models/loan/loan-request";
import { LoanRequestLog } from "@models/loan/loan-request-log";
import { BaseService } from "./interfaces/Ibaseservice";
import { LoanRequestLogService } from "./interfaces/loan/Iloan-log-request-service";
import { LoanRequestService } from "./interfaces/loan/Iloan-request-service";
import { ILoanService, LoanService } from "./interfaces/loan/Iloanservice";
const _loanService = new LoanService(new LoanRequestService({}) ,new LoanRequestLogService({}))

const isProduction = process.env["NODE_ENV"] === "production";

export function getLoanService(): ILoanService {	
	return _loanService;
}