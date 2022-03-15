import { LoanRequestLog } from "@entities/loan/loan-request-log";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { ILoanRequestLogRepository } from "@repository/interface/loan/Iloan-request-log-repository";
import { ILoanRequestLogService } from "@services/interfaces/loan/Iloan-log-request-service";
import { BaseService } from "../base-service";
export class LoanRequestLogService extends BaseService<LoanRequestLog> implements ILoanRequestLogService {
    convertToModel: (modelInDb: any) => Promise<LoanRequestLog>;
    constructor(private moment: any, private Op: any, _loanRequestLogRepository: ILoanRequestLogRepository, private _customerRepository: ICustomerRepository) {
        super(_loanRequestLogRepository);
    }
    getByCustomerID = (customerID: number) => new Promise<LoanRequestLog>(async (resolve, reject) => {
        try {
            let repo = this._baseRepository as ILoanRequestLogRepository;
            let request = await repo.getByCustomerID(customerID);
            // console.log(request);
            resolve(request);
        }
        catch (err) {
            console.error(err);
            reject(err);
        }
    });

    getByLoanRequestIDAndRequestDate = ({ requestDate, loanRequestID }: any) => new Promise<any>(async (resolve, reject) => {
        let response = await this._baseRepository.search({ requestDate, loanRequestID }, 0, 1);
        resolve(response.rows[0] || {});
    })
    search = (parameters: any, customer?: any) => new Promise<any>(async (resolve, reject) => {
        try {
            console.log("LoanRequestLog Search")
            let { pageNumber, maxSize, from, to, status, requestId, orderBy = "updatedAt" }: any = parameters;
            pageNumber = +pageNumber;
            pageNumber -= 1;
            let repo = this._baseRepository as ILoanRequestLogRepository;
            let queryParameters: any = {};
            // if(customer && Object.keys(customer).length==0){
            //     // resolve({status:false,data:{}});
            // }else{
            if (customer && Object.keys(customer).length > 0) {
                queryParameters = { customerID: customer.id };
            }
            if (from && to) {
                queryParameters["requestDate"] = {
                    [this.Op.between]: [from, to]
                }
                // {"fieldOfYourDate" : {[Op.between] : [startedDate , endDate ]}}
            } else if (from && !to) {
                queryParameters["requestDate"] = {
                    [this.Op.between]: [from, this.moment()]
                }
            } else if (!from && to) {
                queryParameters["requestDate"] = {
                    [this.Op.between]: [this.moment().subtract(1, 'year'), to]
                }
            }

            if (status) {
                queryParameters["requestStatus"] = status;
            }
            if (requestId) {
                queryParameters["requestId"] = requestId;
            }

            let requests = await repo.search(queryParameters, pageNumber, maxSize);
            resolve({ status: true, data: requests });

        }
        catch (err) {
            console.error(err);
            resolve({ status: false, data: err });
        }
    });
}