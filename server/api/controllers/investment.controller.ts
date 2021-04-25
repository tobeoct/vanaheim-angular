
// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json({limit: '100mb'})
// const expAutoSan = require('express-autosanitizer');
// let timeout = require('connect-timeout')
// const {ProcessInvestment} = require("@services/implementation/investment/investment-service");
// const {verifyRequest,hasValue,spamChecker,createResponse} = require("@services/implementation/common/util")
// const investmentsRouter = require('express').Router();

// investmentsRouter.route('/').get(
//   async (req, res) => {
//     console.log("Getting Investments");
//     res.send("Hello Investments")
//   }
// )
// investmentsRouter.route('/:id').get(
//   async (req, res) => {
//     console.log("Getting Investment");
//     res.send("Hello Investment ")
//   }
// ).put( async (req, res) => {
//   console.log("Putting Investment");
//   res.send("Put Investment ")
// })

// investmentsRouter.post('/new',[jsonParser, expAutoSan.route],async (req, res) => {
  
//   if(verifyRequest(req,"investment")&&spamChecker(req.ip,"investment")){
//   try{
//     ProcessInvestment(req.body.email,req.body.payload).then((resp=>{
//       console.log(resp)
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
// module.exports = investmentsRouter;