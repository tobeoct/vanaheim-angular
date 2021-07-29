
import { IRepaymentService } from '@services/interfaces/Irepayment-service';
import { GET, POST, route } from 'awilix-express';
@route('/api/repayment')
export default class UserController {

    constructor(private sanitizer: any, private _repaymentService: IRepaymentService) {

    }
    @route('/plan')
    @POST()
    repaymentPlan = async (req: any, res: any, next: any) => {
        console.log("Repayment Plan")
        let response: any = await this._repaymentService.processRepaymentPlan(req.body);
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data;
        } else {
            res.statusCode = 400;
            res.data = response;
        }


        next()
    }
    @route('/repay')
    @POST()
    repay = async (req: any, res: any, next: any) => {
        console.log("Repayment")
        let response: any = await this._repaymentService.processRepayment(req.body);
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data;
        } else {
            res.statusCode = 400;
            res.data = response;
        }


        next()
    }
    @route('/getRepayments')
    @GET()
    getRepayments = async (req: any, res: any, next: any) => {
        console.log("Get Repayment")
        let id = this.sanitizer.escape(req.query.disbursedLoanID);
        if (!id) {
            res.statusCode = 400;
            res.data = "No id provided";
        } else {
            let response: any = await this._repaymentService.getByDisbursedLoanID(id);
            // if (response.status == true) {
                res.statusCode = 200;
                res.data = response;//s.data;
            // } else {
            //     res.statusCode = 400;
            //     res.data = response;
            // }
        }


        next()
    }

    @route('/getRepaymentHealth')
    @GET()
    getRepaymentHealth = async (req: any, res: any, next: any) => {
        console.log("Get Repayment Health")
        let id = this.sanitizer.escape(req.query.disbursedLoanID);
        if (!id) {
            res.statusCode = 400;
            res.data = "No id provided";
        } else {
            let response: any = await this._repaymentService.getRepaymentHealth(id);
            if (response.status == true) {
                res.statusCode = 200;
                res.data = response.data;
            } else {
                res.statusCode = 400;
                res.data = response;
            }
        }

        next()
    }
}