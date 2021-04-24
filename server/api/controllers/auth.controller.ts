
import bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: '100mb'})
const expAutoSan = require('express-autosanitizer');
const {generateJWTToken} = require('@services/implementation/common/auth-service')
let timeout = require('connect-timeout')
const authRouter = require('express').Router();
// const { getByUserName, updateUserPassword } = require('@services/implementation/user-service');
import UserService from '@services/implementation/user-service';

authRouter.post('/login',[jsonParser], async (req:any, res:any,next:any) => {
    // console.log("Login User", req.body, req.data,req.db,req.session);
    let uname = req.body.username;
    let pwd = req.body.password;
    let type = req.body.type;
    // let socialUser = req.body.socialUser;
    // if(type=="social"){
    //   res.data = {uname, password:undefined};
    //   req.session.userData
    // }
    for(let k in UserService){
    console.log("Stuff",k)
    }
    let userDetails = await  UserService.getByUserName(req.db, uname);
    if (userDetails) {
      let { password } = userDetails;
      // console.log(req.session)
      if (pwd === password) {
        res.data = {...userDetails, password:undefined};
        req.session.userData = userDetails;
      } else {
        res.statusCode = 400;
        res.data = {
          status: false,
          error: 'Invalid Password'
        };
      }
    } else {
      res.statusCode = 400;
      res.data = {
        status: false,
        error: 'Invalid Username'
      };
    }
    next();
  })
  authRouter.post('/register', async (req:any, res:any) => {
  
  })

  authRouter.get("/logout", (req:any, res:any,next:any) => {
    req.session.destroy((err:any) => {
        if (err) {
            return console.log(err);
        }
        //res.redirect("/")
        res.data = {
          status: true,
          response: 'Logged Out'
        };
        next()
    });
});

authRouter.post("/token", (req:any, res:any,next:any) => {
  try{
    console.log("In Token Controller", req.session.userData)
  if(req.session && req.session.userData){
    const token = generateJWTToken(req.session.userData);
    res.statusCode = 200;
    res.data = {
      status: true,
      response: token
    }
  }else{
    res.statusCode = 401;
        res.data = {
          status: false,
          error: "Invalid Session"
        }
  }
  
  next();
} catch (e) {
  next(e)
}
});
  authRouter.put('/password', async (req:any, res:any, next:any) => {
    try {
      let oldPwd = req.body.old_password;
      let newPwd = req.body.new_password;
      if (!oldPwd && !newPwd) {
        res.statusCode = 400;
        res.data = {
          status: false,
          error: 'Invalid Parameters'
        }
      }
      let uname = req.session.userData.username;
      let userDetails = await UserService.getByUserName(req.db, uname);
      if (oldPwd !== userDetails.password) {
        res.statusCode = 400;
        res.data = {
          status: false,
          error: "Old Password doesn't match"
        }
      } else {
        let updateRes = await UserService.updateUserPassword(req.db,uname,newPwd)
        res.data = { message :"Password updated successfully"};
      }  
      next();
    } catch (e) {
      next(e)
    }
  })

export default authRouter;