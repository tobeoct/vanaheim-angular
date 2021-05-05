import { GET, POST, route,before, PUT } from 'awilix-express'; 
import axios from 'axios';
// import bodyParser = require('body-parser');
import { IAuthService } from '@services/interfaces/Iauth-service';
import { IUserService } from '@services/interfaces/Iuser-service';
import  UtilService from '@services/implementation/common/util';
import Encryption from '@services/implementation/common/encryption-service';
import { LoginType } from '@models/helpers/enums/logintype';
import { UserCategory } from '@models/helpers/enums/usercategory';
import NotificationService from '@services/implementation/notification-service';
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
    constructor(private _userService:IUserService,private _notificationService:NotificationService, private _authService:IAuthService, private _encryption:Encryption) {

    }
    @route('/login')
    @POST()
    login=async(req:any, res:any,next:any) => {
      const response = await this._userService.login(req.body);
      if(response.status==true){
        
        try{
          console.log("Registering Device after login");
          await this._notificationService.registerDevice({browserID:req.body.browserID,customerID: response.userData.customer.id});
          }catch(err){
            console.log("Error Registering device",err,req.body.browserID);
          }
        res.statusCode = 200;
        res.data = response.data
       req.session.userData = response.userData;
       }else{
        res.statusCode = 400;
        res.data = response;
      }
     
      next();
    }

    @route('/register')
    @POST()
    register=async(req:any, res:any, next:any) => {
 const response = await this._userService.register(req.body);
 if(response.status==true){
  try{
    console.log("Registering Device after registration");
    await this._notificationService.registerDevice({browserID:req.body.browserID,customerID: response.userData.customer.id});
    }catch(err){
      console.log("Error Registering device",err,req.body.browserID);
    }
    
   res.statusCode = 200;
   res.data = response.data;
  req.session.userData = response.userData;
  }else{
   res.statusCode = 400;
   res.data = response;
 }

    next();
    }

    @route('/resetpassword')
    @POST()
    resetPassword=async(req:any, res:any, next:any) => {
      console.log("Reset Password Controller")
 const response = await this._userService.resetPassword(req.body);
 if(response.status==true){
 
   res.statusCode = 200;
   res.data = {...response.data, passwordHash:undefined,passwordSalt:undefined,token:undefined};
  req.session.userData = response.userData;
  }else{
   res.statusCode = 400;
   res.data = response;
 }
    next();
    }

    @route('/verify')
    @POST()
    verify=async(req:any, res:any, next:any) => {
      console.log("Verify Controller")
    let uname= req.body.username;
    let userDetails = await this._userService.getByUserName(uname);
    res.statusCode =200;
    if (userDetails && Object.keys(userDetails).length>0) {
     
        res.data = {verified:true};
      
    } else {
      res.data ={verified: false};
    }
    next();
    }
    @route('/logout')
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
      res.data ={token}
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