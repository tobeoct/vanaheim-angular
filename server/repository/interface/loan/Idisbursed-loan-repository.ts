import { DisbursedLoan } from "@entities/loan/disbursed-loan";
import { IBaseRepository } from "../Ibase-repository";

export interface IDisbursedLoanRepository extends IBaseRepository<DisbursedLoan> {
    getByRequestAndLogID: (requestID: number, requestLogId: number) => Promise<DisbursedLoan>
    getByRequestID: (requestID: number) => Promise<DisbursedLoan[]>
}