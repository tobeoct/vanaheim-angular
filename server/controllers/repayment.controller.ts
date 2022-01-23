
import { VanaheimBodyRequest, VanaheimQueryRequest } from '@models/express/request';
import { VanaheimTypedResponse } from '@models/express/response';
import { IRepaymentService } from '@services/interfaces/Irepayment-service';
import { GET, POST, route } from 'awilix-express';
@route('/api/repayment')
export default class UserController {

    constructor(private sanitizer: any, private _repaymentService: IRepaymentService) {

    }
    @route('/plan')
    @POST()
    repaymentPlan = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        console.log("Repayment Plan")
        let response: any = await this._repaymentService.processRepaymentPlan(req.body,req.session?.userData);
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = {data:response.data};
        } else {
            res.statusCode = 400;
            res.payload = {message:response.message};
        }


        next()
    }
    @route('/repay')
    @POST()
    repay = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        console.log("Repayment")
        let response: any = await this._repaymentService.processRepayment(req.body);
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = {data:response.data};
        } else {
            res.statusCode = 400;
            res.payload = {message:response.message};
        }


        next()
    }
    @route('/getRepayments')
    @GET()
    getRepayments = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        console.log("Get Repayment")
        let id = this.sanitizer.escape(req.query.disbursedLoanID);
        if (!id) {
            res.statusCode = 400;
            res.payload = {message:"No id provided"};
        } else {
            let response: any = await this._repaymentService.getByDisbursedLoanID(id);
            // if (response.status == true) {
                res.statusCode = 200;
                res.payload = {data:response};//s.data;
            // } else {
            //     res.statusCode = 400;
            //     res.payload = response;
            // }
        }


        next()
    }

    @route('/getRepaymentHealth')
    @GET()
    getRepaymentHealth = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        console.log("Get Repayment Health")
        let id = this.sanitizer.escape(req.query.disbursedLoanID);
        if (!id) {
            res.statusCode = 400;
            res.payload = {message:"No id provided"};
        } else {
            let response: any = await this._repaymentService.getRepaymentHealth(id);
            if (response.status == true) {
                res.statusCode = 200;
                res.payload = {data:response.data};
            } else {
                res.statusCode = 400;
                res.payload = {message:response.message};
            }
        }

        next()
    }
}