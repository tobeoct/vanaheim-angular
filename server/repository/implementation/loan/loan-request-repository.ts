import { LoanRequest } from "@models/loan/loan-request";
import { ILoanRequestRepository } from "@repository/interface/loan/Iloan-request-repository";
import { BaseRepository } from "../base-repository";


 export class LoanRequestRepository extends BaseRepository<LoanRequest> implements ILoanRequestRepository{
   super(){

   }
}