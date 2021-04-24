// const dotenv = require('dotenv');
// dotenv.config();
module.exports = {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    ADMIN_EMAIL:process.env.LOAN_EMAIL,
CC_EMAIL:process.env.LOAN_EMAIL,
INVESTMENT_EMAIL: process.env.INVESTMENT_EMAIL,
SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
  };