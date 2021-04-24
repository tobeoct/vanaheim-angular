import { IRepaymentRepository } from "@repository/interface/Irepayment-repository";
import { Repayment } from "@models/loan/repayment";
import { BaseRepository } from "./base-repository";


 export class RepaymentRepository extends BaseRepository<Repayment> implements IRepaymentRepository{
   super(){

   }
}