
import { IInvestmentService } from '@services/interfaces/investment/Iinvestmentservice';
import { POST, route } from 'awilix-express'; 
@route('/api/investments')
export default class UserController {

    constructor(private _investmentService:IInvestmentService) {

    }
    @route('/apply')
    @POST()
    apply =async (req:any, res:any,next:any) => {
        let response:any = await this._investmentService.process(req.body);
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