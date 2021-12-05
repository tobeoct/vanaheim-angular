
import { ApprovedEarning } from "@models/investment/approved-investment";
import { EarningRequest } from "@models/investment/investment-request";
import { IApprovedEarningRepository } from "@repository/interface/investment/Iapproved-earning-repository";
import { IEarningRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";
import { IEarningRequestRepository } from "@repository/interface/investment/Iinvestment-request-repository";
import { IApprovedEarningService } from "@services/interfaces/investment/Iapproved-earning-service";
import { BaseResponse, BaseService } from "@services/implementation/base-service";
import { IEarningPayoutRepository } from "@repository/interface/investment/Iearning-payout-repository";
export class ApprovedEarningService extends BaseService<ApprovedEarning> implements IApprovedEarningService {
  constructor(private _approvedEarningRepository: IApprovedEarningRepository, private _earningPayoutRepository: IEarningPayoutRepository, private _earningRequestRepository: IEarningRequestRepository, private _earningRequestLogRepository: IEarningRequestLogRepository) {
    super(_approvedEarningRepository);
  }
  getByEarningRequestAndLogId= (earningRequestID: number, earningRequestLogID: number) => {
    return new Promise<BaseResponse<ApprovedEarning>>(async (resolve,reject)=>{
      try {
        resolve({ status: true, data: await this._approvedEarningRepository.getByRequestAndLogID(earningRequestID,earningRequestLogID) })
      } catch (err: any) {
        console.log(err);
        reject({ status: false, data: "We cannot fetch your details at the moment" });
      }
    })
  }

  getByEarningRequestId = (earningRequestID: number) => new Promise<BaseResponse<ApprovedEarning>>(async (resolve, reject) => {
    try {
      resolve({ status: true, data: await this.getApprovedEarning(earningRequestID) })
    } catch (err: any) {
      console.log(err);
      reject({ status: false, data: "We cannot fetch your details at the moment" });
    }
  })
  getAllByEarningRequestId = (earningRequestID: number) => new Promise<BaseResponse<ApprovedEarning[]>>(async (resolve, reject) => {
    try {
      resolve({ status: true, data: await this.getApprovedEarnings(earningRequestID) })
    } catch (err: any) {
      console.log(err);
      reject({ status: false, data: "We cannot fetch your details at the moment" });
    }
  })

  getWithPayout = (earningRequestID: number) => new Promise<any>(async (resolve, reject) => {
    try {
      let approvedEarning = await this.getApprovedEarning(earningRequestID);
      if (!approvedEarning) resolve({ status: "No approved earning available" })
      let repayments = await this._earningPayoutRepository.getByApprovedEarningID(approvedEarning.id);
      resolve({ status: true, data: { approvedEarning, repayments } })
    } catch (err: any) {
      console.log("getApprovedEarningWithRepayment=>" + err)
      resolve({ status: false, data: "We cannot fetch your details at the moment" })
    }
  })
  private getApprovedEarning = (earningRequestID: number) => new Promise<ApprovedEarning>(async (resolve, reject) => {
    try {
      let earningRequest = await this._earningRequestRepository.getById(earningRequestID) as EarningRequest;

      if (!earningRequest) { console.log("getApprovedEarningById => No loan request found"); reject("Cannot retrieve approved earning record"); return; }
      let earningRequestLog = await this._earningRequestLogRepository.search({ requestDate: earningRequest.requestDate, earningRequestID }, 0, 1);
      if (!earningRequestLog) { console.log("getApprovedEarningById => No loan request log"); reject("Cannot retrieve approved earning record"); return; }
      let approvedEarning = await this._approvedEarningRepository.getByRequestAndLogID(earningRequestID, earningRequestLog.rows[0]?.id ?? 0) as ApprovedEarning;
      resolve(approvedEarning)
    } catch (err: any) {
      console.log(err);
      reject(err);
    }
  })
  private getApprovedEarnings = (earningRequestID: number) => new Promise<ApprovedEarning[]>(async (resolve, reject) => {
    let approvedEarnings = await this._approvedEarningRepository.getByRequestID(earningRequestID);
    resolve(approvedEarnings);

  })
}