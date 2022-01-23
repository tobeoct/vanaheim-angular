
import { ApprovedEarning } from "@entities/investment/approved-investment";
import { IBaseRepository } from "../Ibase-repository";

export interface IApprovedEarningRepository extends IBaseRepository<ApprovedEarning> {
    getByRequestAndLogID: (requestID: number, requestLogId: number) => Promise<ApprovedEarning>
    getByRequestID: (requestID: number) => Promise<ApprovedEarning[]>
}