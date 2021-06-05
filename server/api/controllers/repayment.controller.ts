
import { IRepaymentService } from '@services/interfaces/Irepayment-service';
import { GET, POST, route } from 'awilix-express'; 
@route('/api/repayment')
export default class UserController {

    constructor(private _repaymentService:IRepaymentService) {

    }
    @route('/plan')
    @POST()
    repaymentPlan =async (req:any, res:any,next:any) => {
        console.log("Repayment Plan")
        let response:any = await this._repaymentService.processRepaymentPlan(req.body);
        if(response.status==true){
            res.statusCode = 200;
            res.data = response.data;
        }else{
            res.statusCode = 400;
            res.data = response;
        }
        
    
        next()
    }
}