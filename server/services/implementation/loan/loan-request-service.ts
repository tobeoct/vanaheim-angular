import { Account } from "@models/account";
import { IBaseEntity } from "@models/base-entity";
import { Customer } from "@models/customer";
import { LoanRequestStatus } from "@models/helpers/enums/loanrequeststatus";
import { BaseStatus } from "@models/helpers/enums/status";
import { LoanRequest } from "@models/loan/loan-request";
import { LoanRequestLog } from "@models/loan/loan-request-log";
import { IAccountRepository } from "@repository/interface/Iaccount-repository";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { ILoanTypeRequirementRepository } from "@repository/interface/Iloantyperequirement-repository";
import { ILoanRequestLogRepository } from "@repository/interface/loan/Iloan-request-log-repository";
import { ILoanRequestRepository } from "@repository/interface/loan/Iloan-request-repository";
import { ILoanRequestService } from "@services/interfaces/loan/Iloan-request-service";
import { ILoanTypeRequirementService } from "@services/interfaces/loan/Iloan-type-requirement-service";
import { AccountInfo } from "src/app/modules/loan/shared/account-info/account-info";
import { LoanDetails } from "src/app/modules/loan/shared/loan-calculator/loan-details";
import { BaseResponse, BaseService } from "../base-service";
import UtilService from "../common/util";

export type SearchResponse<T>={
    count:number,
    rows:T
}

export class LoanRequestService extends BaseService<LoanRequest> implements ILoanRequestService {
    convertToModel: (modelInDb: any) => Promise<LoanRequest>;
    constructor(private moment: any, private _db: any, private Op: any, private _loanRequestLogRepository: ILoanRequestLogRepository, private _loanTypeRequirementService: ILoanTypeRequirementService, private _customerRepository: ICustomerRepository, private _accountRepository: IAccountRepository, private _loanTypeRequirementRepository: ILoanTypeRequirementRepository, private _utilService: UtilService, _loanRequestRepository: ILoanRequestRepository) {
        super(_loanRequestRepository);
    }
    process = () => new Promise<any>(() => {

    });
    search = (parameters: any, customer?: any) => new Promise<BaseResponse<SearchResponse<any[]>>>(async (resolve) => {
        try {
            console.log("LoanRequest Search")
            let { pageNumber, maxSize, from, to, status, requestId }: any = parameters;
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
        catch (err:any) {
            console.error(err);
            resolve({ status: false, data: err });
        }
    });

    getLatestLoan = (userData: any) => new Promise<any>(async (resolve) => {
        try {


            let repo = this._baseRepository as ILoanRequestRepository;
            const customer = await this._customerRepository.getByUserID(userData.id);

            let queryParameters: any = { customerID: customer.id };
            queryParameters["requestStatus"] = { [this.Op.not]: "Completed" };
            // queryParameters["order"]= [['requestDate', 'DESC']]
            let requests = await repo.search({ ...queryParameters }, 0, 1, [['requestDate', 'DESC']]);
            // console.log("Latest Loan Requests",requests)
            resolve({ status: true, data: requests ? requests["rows"][0] ? requests["rows"][0] : {} : {} });
        }
        catch (err:any) {
            console.error(err);
            resolve({ status: false, message: err });
        }
    });
    getByCustomerID = (customerID: number) => new Promise<LoanRequest>(async (resolve, reject) => {
        try {
            let repo = this._baseRepository as ILoanRequestRepository;
            let request = await repo.getByCustomerID(customerID);
            // console.log("Loan Request",request);
            resolve(request);
        }
        catch (err:any) {
            console.error(err);
            reject(err);
        }
    });
    createLoanRequest = (request: any, customer: Customer) => new Promise<any>(async (resolve, reject) => {
        try {
            const category = request.category;
            let templates: IBaseEntity[] = [];


            // this._templateService.generatePDF("Loan Application",[c],"Test");
            let loanRequest = await this.getByCustomerID(customer.id);
            console.log("loan Request", loanRequest)
            if (loanRequest && loanRequest.requestStatus != LoanRequestStatus.NotQualified && loanRequest.requestStatus != LoanRequestStatus.Completed) {
                throw "You have a loan that we are currently still processing";

            } else {
                if (!loanRequest) {
                    loanRequest = new LoanRequest();
                }

            }
            const loanApplication = request.loanApplication;
            const loanType = loanApplication.loanType;
            const applyingAs = loanApplication.applyingAs;
            const loanProduct = loanApplication.loanProduct;
            if (!loanApplication.loanCalculator) throw "Please provide loan details";
            const loanDetails: LoanDetails = JSON.parse(loanApplication.loanCalculator) as LoanDetails;
            if (!loanDetails || Object.keys(loanDetails).length == 0) throw "Please provide loan details";
            if (!loanApplication.accountInfo) throw "Please provide account details";
            const accountInfo: AccountInfo[] = JSON.parse(loanApplication.accountInfo) as AccountInfo[];
            if (!accountInfo || accountInfo.length < 1) throw "Please provide account details";

            loanRequest.createdAt = new Date();
            loanRequest.requestId = this._utilService.autogenerate({ prefix: "LOAN" });
            loanRequest.code = loanRequest.requestId;
            loanRequest.requestStatus = LoanRequestStatus.Pending;
            //Fetch from db  or cache instead
            // loanRequest.loanType = new LoanType();
            loanRequest.loanType = loanType;
            // loanRequest.loanType.code = this._utilService.autogenerate({prefix:"LTYP"});
            loanRequest.applyingAs = applyingAs;
            // Fetch from db or cache instead
            // loanRequest.loanProduct= new LoanProduct();
            loanRequest.loanProduct = loanProduct;
            loanRequest.requestDate = new Date();
            loanRequest.status = BaseStatus.Active;
            loanRequest.loanPurpose = loanDetails.purpose;
            loanRequest.tenure = loanDetails.tenure;
            loanRequest.amount = this._utilService.convertToPlainNumber(loanDetails.loanAmount);
            loanRequest.monthlyPayment = this._utilService.convertToPlainNumber(loanDetails.monthlyRepayment);
            loanRequest.totalRepayment = this._utilService.convertToPlainNumber(loanDetails.totalRepayment);
            loanRequest.rate = loanDetails.rate || 0;
            let mDate = this.moment().add(+loanDetails.tenure, loanDetails.denominator.toLowerCase());
            loanRequest.maturityDate = mDate.format("MMMM Do YYYY");
            loanRequest.loanTypeRequirementID = 0;
            //Check is account exists first
            let account1 = new Account();
            let account2 = new Account();
            let accountsInDb: Account[] = await this._accountRepository.getByCustomerID(customer.id) as Account[];
            if (!accountInfo[0].id || accountInfo[0].id == 0) {
                let accountInDb = accountsInDb.find(c => c.bank == accountInfo[0].bank && c.number == accountInfo[0].accountNumber);
                if (!accountInDb) {
                    account1 = new Account();
                    account1.bank = accountInfo[0].bank;
                    account1.code = this._utilService.autogenerate({ prefix: "ACC" });
                    account1.createdAt = new Date();
                    account1.customerID = customer.id;
                    account1.number = accountInfo[0].accountNumber;
                    account1.name = accountInfo[0].accountName;
                    let accountInDb = await this._accountRepository.create(account1);

                }
                else {

                    account1 = Object.assign(accountInDb, new Account());
                }
            } else {
                let a: any = await this._accountRepository.getById(accountInfo[0].id);
                if (!a || Object.keys(a).length == 0) throw "Invalid account";
                account1 = Object.assign(a.dataValues as Account, new Account());
            }

            if (accountInfo.length > 1) {
                if (!accountInfo[1].id || accountInfo[1].id == 0) {
                    let accountInDb = accountsInDb.find(c => c.bank == accountInfo[1].bank && c.number == accountInfo[1].accountNumber);
                    if (!accountInDb) {
                        account2.bank = accountInfo[1].bank;
                        account2.code = this._utilService.autogenerate({ prefix: "ACC" });
                        account2.createdAt = new Date();
                        account2.customerID = customer.id;
                        // account2.customerID = 1;
                        account2.number = accountInfo[1].accountNumber;
                        account2.name = accountInfo[1].accountName;
                        console.log(account2)
                        let accountInDb = await this._accountRepository.create(account2);
                        console.log("accountInDb", accountInDb);
                    } else {

                        account2 = Object.assign(accountInDb, new Account());
                    }

                }
                else {
                    let a: any = await this._accountRepository.getById(accountInfo[1].id);
                    if (!a || Object.keys(a).length == 0) throw "Invalid account";
                    account2 = Object.assign(a.dataValues as Account, new Account());
                }
            }

            loanRequest.accountNumber = accountInfo.length > 1 ? account2.number : account1.number;
            loanRequest.denominator = "Months";
            loanRequest.customerID = customer.id;
            let loanRequestInDb = loanRequest
            if(!loanRequest.id ||loanRequest.id==0){loanRequestInDb = await this._baseRepository.create(loanRequest)}
            else {await this._baseRepository.update(loanRequest);}
            let loanRequestLog = loanRequest as LoanRequestLog;
            loanRequestLog.loanRequestID = loanRequestInDb.id;
            let loanRequestLogInDb = await this._loanRequestLogRepository.create(loanRequestLog);
            loanRequest.loanTypeRequirements = await this._loanTypeRequirementService.createLoanRequirement(loanApplication, category, customer);
            loanRequest.loanTypeRequirements.loanRequestLogID = loanRequestLogInDb.id || 0;
            loanRequest.loanTypeRequirements.loanType = loanRequest.loanType;

            let ltRInDb = await this._loanTypeRequirementRepository.create(loanRequest.loanTypeRequirements);
            loanRequest.loanTypeRequirementID = ltRInDb.id;
            loanRequestLog.loanTypeRequirementID = ltRInDb.id;
            loanRequest.id = loanRequestInDb.id;
            // save loan requirements 
            loanRequestInDb = await this._baseRepository.update(loanRequest);
            loanRequestLogInDb = await this._loanRequestLogRepository.update(loanRequestLog);

            templates.push(Object.assign(new LoanRequest(),loanRequest));
            templates.push(account1);
            if (account2.bank) templates.push(account2);
            if (category == "personal") {
                templates.push(loanRequest.loanTypeRequirements.nok.customer)
                templates.push(loanRequest.loanTypeRequirements.employment)
                templates.push(loanRequest.loanTypeRequirements.nok)
            } else {
                templates.push(loanRequest.loanTypeRequirements.company)
                templates.push(...loanRequest.loanTypeRequirements.shareholders)
                templates.push(loanRequest.loanTypeRequirements.collateral)
            }
            console.log(templates);
            resolve({ loanRequest, templates });
        } catch (err:any) {
            console.log(err);
            reject(err);
            // resolve({status:false, data:err.message});
        }
    })


}