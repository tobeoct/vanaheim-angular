import { EarningRequestLog } from "@entities/investment/investment-request-log";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { IEarningRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository";
import { IEarningRequestLogService } from "@services/interfaces/investment/Iinvestment-log-request-service";
import { BaseService } from "../base-service";

export class EarningRequestLogService extends BaseService<EarningRequestLog> implements IEarningRequestLogService{
    constructor(private moment:any,private Op:any, _earningRequestLogRepository:IEarningRequestLogRepository, private _customerRepository:ICustomerRepository ){
        super(_earningRequestLogRepository);
    }
    convertToModel: (modelInDb: any) => Promise<EarningRequestLog>;
    getByCustomerID=(customerID:number) =>  new Promise<EarningRequestLog>(async (resolve,reject)=>{
        try{
        let repo = this._baseRepository as IEarningRequestLogRepository;
        let request = await repo.getByCustomerID(customerID);
        // console.log(request);
        resolve(request);
        }
        catch(err){
            console.error(err);
            reject(err);
        }
    });
    
    getByEarningRequestIDAndRequestDate=({requestDate,earningRequestID}:any) => new Promise<any>(async (resolve,reject)=>{
        let response = await this._baseRepository.search({requestDate,earningRequestID},0,1);
        resolve(response.rows[0]||{});
    })
    search=(parameters:any,customer?:any) =>  new Promise<any>(async (resolve,reject)=>{
        try{
            console.log("EarningRequestLog Search")
            let {pageNumber,maxSize,from,to,status,requestId,orderBy="updatedAt"}:any = parameters;
            pageNumber = +pageNumber;
            pageNumber-=1;
        let repo = this._baseRepository as IEarningRequestLogRepository;
        let queryParameters:any={}; 
            // if(customer && Object.keys(customer).length==0){
            //     // resolve({status:false,data:{}});
            // }else{
                if(customer && Object.keys(customer).length>0){
         queryParameters = {customerID:customer.id};
            }
            if(from && to) {
                queryParameters["requestDate"]= {
                    [this.Op.between]: [from, to]
                }
                // {"fieldOfYourDate" : {[Op.between] : [startedDate , endDate ]}}
            }else if(from && !to){
                queryParameters["requestDate"]= {
                    [this.Op.between]: [from, this.moment()]
                }
            }else if(!from && to){
                queryParameters["requestDate"]= {
                    [this.Op.between]: [this.moment().subtract(1, 'year'), to]
                }
            }

            if(status){
                queryParameters["requestStatus"] = status; 
            }
            if(requestId){
                queryParameters["requestId"] = requestId; 
            }

        let requests = await repo.search(queryParameters,pageNumber,maxSize);
        resolve({status:true,data:requests});
            
        }
        catch(err){
            console.error(err);
            resolve({status:false,message:err});
        }
    });
 }