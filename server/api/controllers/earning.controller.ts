
import { IEarningService } from '@services/interfaces/investment/Iinvestmentservice';
import { POST, route } from 'awilix-express'; 
@route('/api/earnings')
export default class EarningsController {

    constructor(private _earningService:IEarningService) {

    }
    @route('/apply')
    @POST()
    apply =async (req:any, res:any,next:any) => {
        let response:any = await this._earningService.process(req.session.userData.customer,req.body);
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