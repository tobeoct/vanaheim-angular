import { GET, POST, route,before, PUT } from 'awilix-express'; 
import axios from 'axios';
// import bodyParser = require('body-parser');
import { IAuthService } from '@services/interfaces/Iauth-service';
import { IUserService } from '@services/interfaces/Iuser-service';
import  UtilService from '@services/implementation/common/util';
// const jsonParser = bodyParser.json({limit: '100mb'})
const expAutoSan = require('express-autosanitizer');
@route('/api/auth')
export default class AuthController {

  instance = axios.create({
    method: 'post',
    baseURL: 'https://app.verified.ng',
    timeout: 20000,
    headers: {'Content-Type': 'application/json','apiKey': "zeb'V8U*-h*e-jO'",'userid':'1543318849803','mode': 'no-cors'},
  });
   accountEnquiryInstance = axios.create({
    method: 'post',
    baseURL: 'https://app.verified.ng',
    timeout: 20000,
    headers: {'Content-Type': 'application/json','api-key': "7UBUKPMxF8i99DgB",'userid':'1543318849803'}, //,'accountNumber':body.accountNumber,'bankcode':key},
  });
  
   bvnList:any={
  };
   bankList:any={};
    constructor(private _userService:IUserService, private _authService:IAuthService, private _utilService:UtilService) {

    }
    @route('/login')
    @before([ expAutoSan.route])
    @POST()
    login=async(req:any, res:any,next:any) => {
      // console.log("Login User", req.body, req.data,req.db,req.session);
      let uname= req.body.username;
      let pwd = req.body.password;
      let type = req.body.type;
      // let socialUser = req.body.socialUser;
      // if(type=="social"){
      //   res.data = {uname, password:undefined};
      //   req.session.userData
      // }
    
      let userDetails = await this._userService.getByUserName(uname);
      if (userDetails) {
        let { passwordHash } = userDetails;
        // console.log(req.session)
        const password = passwordHash;
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
    }

    @route('/register')
    @before([ expAutoSan.route])
    @POST()
    register=async(req:any, res:any) => {
    
    }
  
    @route('/logout')
    @before([ expAutoSan.route])
    @GET()
    logOut= async (req:any, res:any,next:any) => {
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
  }
  
  @route('/token')
  @POST()
  token=async (req:any, res:any,next:any) => {
    try{
    if(req.session && req.session.userData){
      delete(req.session.userData.iat);
      delete(req.session.userData.exp);
      const token =this._authService.generateJWTToken(req.session.userData);
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
  }

  @route('/passwordChange')
  @PUT()
   passwordChange =async (req:any, res:any, next:any) => {
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
        let userDetails = await this._userService.getByUserName(uname);
        if (oldPwd !== userDetails.passwordHash) {
          res.statusCode = 400;
          res.data = {
            status: false,
            error: "Old Password doesn't match"
          }
        } else {
          let updateRes =  this._userService.updateUserPassword(uname,newPwd)
          res.data = { message :"Password updated successfully"};
        }  
        next();
      } catch (e) {
        next(e)
      }
    }


}