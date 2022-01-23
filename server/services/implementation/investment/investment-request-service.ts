import { EarningRequest } from "@entities/investment/investment-request";
import { SearchResponse } from "@models/search-response";
import { IAccountRepository } from "@repository/interface/Iaccount-repository";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { IEarningRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";
import { IEarningRequestRepository } from "@repository/interface/investment/Iinvestment-request-repository";
import { IEarningRequestService } from "@services/interfaces/investment/Iinvestment-request-service";
import { BaseResponse, BaseService } from "../base-service";
import { EnvConstants } from "../common/env.constants";
import UtilService from "../common/util";

export class EarningRequestService extends BaseService<EarningRequest> implements IEarningRequestService {
    convertToModel: (modelInDb: any) => Promise<EarningRequest>;
    constructor(private moment: any, private _db: any, private Op: any, private _earningRequestLogRepository: IEarningRequestLogRepository, private _customerRepository: ICustomerRepository, private _accountRepository: IAccountRepository, private _utils: UtilService, _earningRequestRepository: IEarningRequestRepository) {
        super(_earningRequestRepository);
    }
    process = () => new Promise<any>(() => {

    });
    search = (parameters: any, customer?: any) => new Promise<BaseResponse<SearchResponse<any[]>>>(async (resolve) => {
        try {
            console.log("EarningRequest Search")
            let { pageNumber, maxSize, from, to, status, requestId }: any = parameters;
            pageNumber = +pageNumber;
            pageNumber -= 1;
            let repo = this._baseRepository as IEarningRequestLogRepository;
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

            let requests = await repo.search(queryParameters, pageNumber, maxSize, undefined, [{
                model: this._db.Customer,
                required: true
            }]);
            let rows: any[] = [];
            if (requests) {
                Object.assign(rows, requests.rows);
                rows.map(async (r: any) => {
                    let request: any = {};
                    Object.assign(request, r);
                    // console.log(request.dataValues.customerID);
                    request.dataValues["name"] = request?.dataValues?.Customer?.firstName + " " + request?.dataValues?.Customer?.lastName;
                    // console.log(request)
                    return request.dataValues;
                });

                // console.log("Map Request", rows);
            }


            resolve({ status: true, data: { count: requests.count, rows } });

        }
        catch (err: any) {
            console.error(err);
            resolve({ status: false, data: err });
        }
    });

    getLatestEarnings = (userData: any) => new Promise<any>(async (resolve) => {
        try {


            let repo = this._baseRepository as IEarningRequestRepository;
            const customer = await this._customerRepository.getByUserID(userData.id);

            let queryParameters: any = { customerID: customer.id };
            queryParameters["requestStatus"] = { [this.Op.not]: "Matured" };
            let requests = await repo.search({ ...queryParameters }, 0,EnvConstants.MAX_ACTIVE_EARNING_REQUESTS , [['requestDate', 'DESC']],[{model:this._db.Account}]);
            let earnings = requests ? requests["rows"] : [];
            for (let i = 0; i < earnings.length; i++) {
                let earning = earnings[i];
                if (earning) {
                    let log = await this._earningRequestLogRepository.getByEarningRequestID(earning.id);

                    earning["dataValues"]["earningRequestLogID"] = log?.id;
                }
                earnings[i] = earning;
            }
            resolve({ status: true, data: earnings });
        }
        catch (err: any) {
            console.error(err);
            resolve({ status: false, message: err });
        }
    });
    getByCustomerID = (customerID: number) => new Promise<EarningRequest>(async (resolve, reject) => {
        try {
            let repo = this._baseRepository as IEarningRequestRepository;
            let request = await repo.getByCustomerID(customerID);
            // console.log("Loan Request",request);
            resolve(request);
        }
        catch (err: any) {
            console.error(err);
            reject(err);
        }
    });
}