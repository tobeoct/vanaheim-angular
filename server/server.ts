/*
Copyright 2018 Google Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
   http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const http = require('http');
const https = require('https');
const express = require('express');
const serverless = require('serverless-http');
const compression = require('compression');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout')
const expAutoSan = require('express-autosanitizer');
const httpsRedirect = require('express-https-redirect');
const { apiRouter } = require('@controllers/index.js');
const morgan = require('morgan')
const parseurl = require('parseurl');
const path = require('path');
const expressValidator = require('express-validator');
// const mustacheExpress = require('mustache-express');
// const uniqueValidator = require('mongoose-unique-validator');
// const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const app = express();
// const jsonParser = bodyParser.json({limit: '100mb'})
const { port} = require('@config');
const { clientApiKeyValidation, authorise} = require('@services/implementation/common/auth-service');
const cookieParser = require('cookie-parser');
// This serves static files from the specified directory
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;


app.use(express.static('dist/vanaheim'));
app.use(morgan("combined"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(compression());
app.use(timeout('120s'));
app.use(expAutoSan.all)

const SECRET_KEY = "JWT_SECRET";
// Date.prototype.addDays=function(days) {
//   var result =this.getDate();
//   this.setDate(result + days);
//   return result;
// }

// Date.prototype.getDaysInMonth = function () { 
//   return new Date(this.getFullYear(), this.getMonth());
// };
// Date.prototype.addMonths = function (value) {
//   var n = this.getDate();
//   this.setDate(1);
//   this.setMonth(this.getMonth() + value);
//   this.setDate(Math.min(n, this.getDaysInMonth()));
//   return this;
// };


app.use((req:any,res:any,next:any)=>{
  console.log("Attaching db")
  req.db = {}; //mongoClient.db('test');
  next();
})
// app.get('/',(req:any,res,next)=>{
//    res.status(200).send({
//      status:true,
//      response:'Hello World!'
//    });
// });


// app.use();
// app.use()
// Get all api controllers(routers)

const RedisStore = connectRedis(session)
//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})
redisClient.on('error', function (err:any) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err:any) {
    console.log('Connected to redis successfully');
});
app.use(cookieParser())
app.use(  session({
    store: new RedisStore({ client: redisClient }),
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: true, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60  * 60 * 10, // session max age in miliseconds
       
    }
}))

// app.get("/test", (req:any, res,next) => {
//     const sess = req.session;

//     // if (sess&&sess.authData) {
//     //   console.log("Session Dey")
//     //     next()
//     // } else {
//     //    res.redirect("/")
//     // }
//     console.log(sess)
// });
app.use(authorise.sessionRequest())
app.use('/api',clientApiKeyValidation(),authorise.apiRequest(),apiRouter,authorise.apiResponse())
// app.use()
app.get('*', function(req:any, res:any) {
  console.log( req.session)
  res.sendFile('dist/vanaheim/index.html',{ root: path.resolve(__dirname, '../')  })
})

app.use(authorise.sessionResponse())
//ERROR HANDLING
// app.use(function(req:any, res:any, next:any) {
//   next(createError(404));
//   });
app.use(errorHandler);

function errorHandler (err:any, req:any, res:any, next:any) {
  if(err){
  // res.status(500).send();
  res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};
// render the error page
  console.log(err);
res.status(err.status || 500).send();
// res.render('error');
  }
  // res.render('error', { error: err })
}

// mongoose.connect('mongodb://localhost:27017/vanaheim')
const server = app.listen(port || 8081, () => {

  const host = server.address().address;
  const port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
module.exports.handler=serverless(app);


//LOAN REQUEST PROCESSING
// let formType = req.body.type;
// const dataSet = createPDFJson(validateRequest(req.body,formType))
// ProcessPDF(dataSet,req.body.fileName.trim(),formType).then((template)=>{

//   console.log("Done Processing MY PDF ",req.body.fileName.trim());
//   let customerTemplate = `<div style="width:100% !important;  margin-top:20px;"><p>Dear Customer,<br/><br/>
//   Thank you for your interest in Vanir Capital Limited's loan service.<br/><br/>
//   We acknowledge receipt of your loan request and the documents provided.<br/><br/>
//   Please be informed that your request is receiving attention and an update will be provided soon.
//   <br/><br/>
//   Thank you for your patronage.<br/><br/>
//   Best regards.<br><br><b>Vanir Capital Loans and Capital Finance Team</b></p><div>`;

//   ProcessFiles(req.body.files,dataSet["BVN Verification"]).then((fileNames)=>{
  
//     SendEmail({type:'form',to:ADMIN_EMAIL,attachment:req.body.fileName,fileNames:fileNames,html:template,toCustomer:false}).then(()=>{
//     SendEmail({type:'form',to:req.body.email,attachment:req.body.fileName.trim(),fileNames:null,html:customerTemplate,toCustomer:true}).then(()=>{
//       console.log("Done");
//       let loanCalculator = dataSet["Loan Calculator"];
//       // console.log(loanCalculator);
//       let data = {"Category":titleCase(loanCalculator["Category"]),"For":titleCase(loanCalculator["Loan Purpose"]),"Loan Amount":currencyFormatter(loanCalculator["Loan Amount"]),"Tenure":titleCase(loanCalculator["Tenure"]+" "+ loanCalculator["Period"])};
//       let interestRate = getInterestRate(data.Category,loanCalculator["Loan Amount"]);
//        data["Interest Rate"] =interestRate.rate;
//        data[`${interestRate.paymentType}`] = currencyFormatter(loanCalculator["Monthly Repayment"]);
       
//        ProcessRepayment(req.body.email,data).then((resp)=>{
//         response.isSuccessful=true;
//         response.ResponseCode ="00";
//         response.ResponseDescription="Your application was submitted successfully";
//         response.Data = data;
//         res.send(response);
//        }).catch(err=>{
//         response.isSuccessful=true;
//         response.ResponseCode ="00";
//         response.ResponseDescription="Your application was submitted successfully";
//         response.Data = payload;
//         console.log(err);
//         res.send(response);
//        })
     
//     });
//   }).catch(err=>{console.log(err); throw new Error(err)});
//   });



// }).catch((err)=>{
//     response.ResponseCode="06"
//     response.Data = err;
//     response.ResponseDescription ="Sorry we can not process your request at the moment. Kindly contact our support team."
//     console.log(err);
//     res.send(response);
// });