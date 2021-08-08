import { GET, POST, route, PUT } from 'awilix-express';
import axios from 'axios';
import { IAuthService } from '@services/interfaces/Iauth-service';
import { IUserService } from '@services/interfaces/Iuser-service';
import Encryption from '@services/implementation/common/encryption-service';
import NotificationService from '@services/implementation/notification-service';
import { UserCategory } from '@models/helpers/enums/usercategory';
@route('/api/auth')
export default class AuthController {

  instance = axios.create({
    method: 'post',
    baseURL: 'https://app.verified.ng',
    timeout: 20000,
    headers: { 'Content-Type': 'application/json', 'apiKey': "zeb'V8U*-h*e-jO'", 'userid': '1543318849803', 'mode': 'no-cors' },
  });
  accountEnquiryInstance = axios.create({
    method: 'post',
    baseURL: 'https://app.verified.ng',
    timeout: 20000,
    headers: { 'Content-Type': 'application/json', 'api-key': "7UBUKPMxF8i99DgB", 'userid': '1543318849803' }, //,'accountNumber':body.accountNumber,'bankcode':key},
  });

  bvnList: any = {
  };
  bankList: any = {};
  constructor(private _userService: IUserService, private _encryption: Encryption, private sanitizer: any, private _notificationService: NotificationService, private _authService: IAuthService) {

  }
  @route('/login')
  @POST()
  login = async (req: any, res: any, next: any) => {
    const response = await this._userService.login(req.body);
    if (response.status == true) {

      try {
        console.log("Registering Device after login");
        await this._notificationService.registerDevice({ browserID: req.body.browserID, customerID: response.userData.customer.id });
      } catch (err) {
        console.log("Error Registering device", err, req.body.browserID);
      }
      res.statusCode = 200;
      res.data = response.data;
      req.session.userData = response.userData;
    } else {
      res.statusCode = 400;
      res.data = response;
    }

    next();
  }

  @route('/register')
  @POST()
  register = async (req: any, res: any, next: any) => {
    const response = await this._userService.register(req.body);
    if (response.status == true) {
      try {
        console.log("Registering Device after registration");
        await this._notificationService.registerDevice({ browserID: req.body.browserID, customerID: req.body.registerAs == "Admin" ? response.userData.staff.id : response.userData.customer.id });
      } catch (err) {
        console.log("Error Registering device", err, req.body.browserID);
      }

      res.statusCode = 200;
      res.data = response.data;
      req.session.userData = response.userData;
    } else {
      res.statusCode = 400;
      res.data = response;
    }

    next();
  }

  @route('/resetpassword')
  @POST()
  resetPassword = async (req: any, res: any, next: any) => {
    console.log("Reset Password Controller")
    const response = await this._userService.resetPassword(req.body);
    if (response.status == true) {

      res.statusCode = 200;
      res.data = { ...response.data, passwordHash: undefined, passwordSalt: undefined, token: undefined };
      req.session.userData = response.userData;
    } else {
      res.statusCode = 400;
      res.data = response;
    }
    next();
  }

  @route('/verify')
  @POST()
  verify = async (req: any, res: any, next: any) => {
    console.log("Verify Controller")
    let uname = req.body.username;
    let userDetails = await this._userService.getByUserName(uname);
    res.statusCode = 200;
    if (userDetails && Object.keys(userDetails).length > 0 && userDetails.category == UserCategory.Customer) {

      res.data = { verified: true };

    } else {
      res.data = { verified: false };
    }
    next();
  }
  @route('/logout')
  @GET()
  logOut = async (req: any, res: any, next: any) => {
    req.session.destroy((err: any) => {
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
  token = async (req: any, res: any, next: any) => {
    try {
      if (req.session && req.session.userData) {
        delete (req.session.userData.iat);
        delete (req.session.userData.exp);
        const token = this._authService.generateJWTToken(req.session.userData);
        res.statusCode = 200;
        res.data = { token }
      } else {
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
  @route("/refresh-session")
  @GET()
  refreshToken = async (req: any, res: any, next: any) => {
    try {
      req.session.touch();
      res.statusCode = 200;
      res.data = "Session refreshed"
      next();
    } catch (err) {
      next();

    }
  }
  @route('/passwordChange')
  @PUT()
  passwordChange = async (req: any, res: any, next: any) => {
    try {
      let oldPwd = req.body.oldPassword;
      let newPwd = req.body.newPassword;
      if (!oldPwd && !newPwd) {
        res.statusCode = 400;
        res.data = { status: false, message: 'Invalid Parameters' }

      }
      let pwd: any = await this._encryption.generateHash(oldPwd);
      let uname = req.session.userData.username;
      let userDetails = await this._userService.getByUserName(uname);
      console.log(pwd, userDetails.passwordHash)
      if (pwd.hash !== userDetails.passwordHash) {
        res.statusCode = 400;
        res.data = { status: false, message: "Old Password doesn't match" }
      } else {
        let encryptedPass: any = await this._encryption.generateHash(newPwd);
        userDetails.passwordHash = encryptedPass.hash;
        userDetails.passwordSalt = encryptedPass.salt;
        this._userService.update(userDetails);
        // let updateRes =  this._userService.updateUserPassword(uname,newPwd)
        res.data = { message: "Password updated successfully" };
      }
      next();
    } catch (e) {
      next()
    }
  }


}