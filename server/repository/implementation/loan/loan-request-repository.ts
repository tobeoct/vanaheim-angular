import { LoanRequest } from "@entities/loan/loan-request";
import { ILoanRequestRepository } from "@repository/interface/loan/Iloan-request-repository";
import { BaseRepository } from "../base-repository";


 export class LoanRequestRepository extends BaseRepository<LoanRequest> implements ILoanRequestRepository{
  constructor(_db:any){
    super(_db.LoanRequest)
  }

  getByCustomerID=(customerID:number)=>  new Promise<LoanRequest>(async (resolve,reject)=>{
      try{
      let response = await this._db.findOne({
        where: {
          customerID: customerID
        },
        order:[["requestDate","DESC"]]
      });
      let dataValues = response?.dataValues as LoanRequest;
      resolve(dataValues);
    }catch(err){
      console.log(err)
      reject(err);
    }
    });
  
    getByRequestID=(requestId:string)=>  new Promise<LoanRequest>(async (resolve,reject)=>{
      try{
      let response = await this._db.findOne({
        where: {
          requestId
        },
        order:[["requestDate","DESC"]]
      });
      let dataValues = response?.dataValues as LoanRequest;
      resolve(dataValues);
    }catch(err){
      console.log(err)
      reject(err);
    }
    });
}