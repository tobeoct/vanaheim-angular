
import { IEarningPayoutService } from '@services/interfaces/investment/Iearning-payout-service';
import { GET, POST, route } from 'awilix-express';
@route('/api/earningspayout')
export default class UserController {

    constructor(private sanitizer: any, private _earningPayoutService: IEarningPayoutService) {

    }
    @route('/plan')
    @POST()
    earningspayoutPlan = async (req: any, res: any, next: any) => {
        console.log("Payout Plan")
        let response: any = await this._earningPayoutService.processEarningPayoutPlan(req.body,req.session?.userData);
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data;
        } else {
            res.statusCode = 400;
            res.data = response;
        }


        next()
    }
    @route('/pay')
    @POST()
    pay = async (req: any, res: any, next: any) => {
        console.log("Payout")
        let response: any = await this._earningPayoutService.processEarningPayout(req.body);
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data;
        } else {
            res.statusCode = 400;
            res.data = response;
        }


        next()
    }
    @route('/')
    @GET()
    getPayouts = async (req: any, res: any, next: any) => {
        console.log("Get Payout")
        let id = this.sanitizer.escape(req.query.approvedEarningID);
        if (!id) {
            res.statusCode = 400;
            res.data = "No id provided";
        } else {
            let response: any = await this._earningPayoutService.getByApprovedEarningID(id);
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

    @route('/getPayoutHealth')
    @GET()
    getPayoutHealth = async (req: any, res: any, next: any) => {
        console.log("Get Payout Health")
        let id = this.sanitizer.escape(req.query.disbursedLoanID);
        if (!id) {
            res.statusCode = 400;
            res.data = "No id provided";
        } else {
            let response: any = await this._earningPayoutService.getEarningPayoutHealth(id);
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