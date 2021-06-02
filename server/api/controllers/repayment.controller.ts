
// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json({limit: '100mb'})
// const expAutoSan = require('express-autosanitizer');
// let timeout = require('connect-timeout')
// const {verifyRequest,hasValue,spamChecker,createResponse} = require("@services/implementation/common/util")
// const {ProcessRepayment} = require("@services/implementation/repayment-service")
// const repaymentsRouter = require('express').Router();


// repaymentsRouter.get('/', async (req, res) => {
//   console.log("Getting Repayments");
//   res.send("Hello Repayments")
// })
// repaymentsRouter.get('/:id', async (req, res) => {

// })
// repaymentsRouter.put('/:id', async (req, res) => {

// })
// repaymentsRouter.post('/send',[jsonParser, expAutoSan.route],async (req, res) => {

//   if(verifyRequest(req,"sendrepayment")&&spamChecker(req.ip,"sendrepayment")){
//   try{
//     ProcessRepayment(req.body.email,req.body.payload).then((resp=>{
//       res.send(resp);
//     })).catch(err=>{
//       res.send(err);
//     })
//   }
//   catch(err){
//     res.send(err);
//   }
//   }
 
// });


// module.exports = repaymentsRouter;







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