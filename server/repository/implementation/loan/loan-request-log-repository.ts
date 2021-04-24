import { LoanRequestLog } from "@models/loan/loan-request-log";
import { ILoanRequestLogRepository } from "@repository/interface/loan/Iloan-request-log-repository";
import { BaseRepository } from "../base-repository";


 export class LoanRequestLogRepository extends BaseRepository<LoanRequestLog> implements ILoanRequestLogRepository{
   super(){

   }
}