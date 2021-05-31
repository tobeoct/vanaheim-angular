// const dotenv = require('dotenv');
// dotenv.config();
// module.exports = {
//     environment: process.env.NODE_ENV,
//     port: process.env.PORT,
//     ADMIN_EMAIL:process.env.LOAN_EMAIL,
// CC_EMAIL:process.env.LOAN_EMAIL,
// INVESTMENT_EMAIL: process.env.INVESTMENT_EMAIL,
// SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
//   };

export default class AppConfig {
  environment:string = "production";
  port:string;
  ADMIN_EMAIL:string;
CC_EMAIL:string;
INVESTMENT_EMAIL:string;
INVESTMENT_EMAIL_PASS:string;
SUPPORT_EMAIL:string;
SUPPORT_EMAIL_PASS:string;
HOST:string;
SERVICE:string;
LOAN_EMAIL:string;
LOAN_EMAIL_PASS:string;
ISSECURE:string;
SESSION_SECRET_KEY:string ;
JWT_SECRET_KEY:string ;
    constructor() {

      this.environment= process.env.NODE_ENV || 'development'
      this.port= process.env.PORT ||''
      this.ADMIN_EMAIL=process.env.LOAN_EMAIL||''
  this.CC_EMAIL=process.env.LOAN_EMAIL||''
  this.INVESTMENT_EMAIL= process.env.INVESTMENT_EMAIL||''
  this.SUPPORT_EMAIL= process.env.SUPPORT_EMAIL||''
  this.INVESTMENT_EMAIL_PASS= process.env.INVESTMENT_EMAIL_PASS||''
  this.HOST = process.env.HOST ||''
  this.SERVICE=process.env.SERVICE||''
  this.LOAN_EMAIL=process.env.LOAN_EMAIL||''
  this.LOAN_EMAIL_PASS=process.env.LOAN_EMAIL_PASS||''
  this.ISSECURE = process.env.ISSECURE||''
  this.SUPPORT_EMAIL_PASS = process.env.SUPPORT_EMAIL_PASS||''
  this.SESSION_SECRET_KEY  =process.env.SESSION_SECRET_KEY||''
  this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY||''
    }
}

// module.exports = AppConfig;