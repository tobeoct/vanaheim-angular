
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: '100mb'})
const expAutoSan = require('express-autosanitizer');
const {generateJWTToken} = require('@services/implementation/common/auth-service')
let timeout = require('connect-timeout')
const usersRouter = require('express').Router();
const { getUserDetails, updateUserPassword } = require('@services/implementation/user-service');


  usersRouter.get('/:id', async (req, res) => {
  
  })
  usersRouter.get('/', async (req, res,next) => {
    console.log("Users Controller", req.session)
    res.statusCode = 200;
    res.data = {
      status: true,
      response: "Gotten"
    }

    next()

  })
  usersRouter.post('/new', async (req, res) => {
  
  })

module.exports = usersRouter;