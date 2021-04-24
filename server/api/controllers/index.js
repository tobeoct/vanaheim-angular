


const loansRouter = require('./loan-controller');
const authRouter =  require('./auth-controller');
const investmentsRouter =  require('./investment-controller');
const repaymentsRouter =  require('./repayment-controller');
const usersRouter =  require('./user-controller');
const commonRouter =  require('./common-controller');
const documentsRouter =  require('./document-controller');
const accountRouter =  require('./account-controller');


const apiRouter = require('express').Router();

apiRouter.use('/auth',authRouter.default)
apiRouter.use('/loans',loansRouter)
apiRouter.use('/investments',investmentsRouter)
apiRouter.use('/repayments',repaymentsRouter)
apiRouter.use('/users',usersRouter)
apiRouter.use('/common',commonRouter)
apiRouter.use('/documents',documentsRouter)
apiRouter.use('/account',accountRouter)


module.exports = {
    apiRouter
}