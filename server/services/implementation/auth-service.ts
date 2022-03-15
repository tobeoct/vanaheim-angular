import AppConfig from "server/config";
import { IAuthService } from "@services/interfaces/Iauth-service";
import { newSessionRoutes, authRoutes } from "../../routes";
class AuthService implements IAuthService{
  
  constructor(private jwt:any,private _appConfig:AppConfig){

  }
  isNewTokenRequired = (httpMethod:any, url:any) => {
    for (let routeObj of newSessionRoutes) {
      if (routeObj.method === httpMethod && routeObj.path === url?.split("?")[0]) {
        return true;
      }
    }
  return false;
  }
    isAuthRequired = (httpMethod:any, url:any) => {
    for (let routeObj of authRoutes) {
      if (routeObj.method === httpMethod && routeObj.path === url?.split("?")[0]) {
        return true;
      }
    }
    return false;
  }
    generateJWTToken = (userData:any) =>{
     return this.jwt.sign(userData, this._appConfig.JWT_SECRET_KEY, {
  
      expiresIn: '10m' // expires in 365 days
  
  });
  }
    verifyToken = (jwtToken:any) =>{
     try{
       console.log("Verifying Token")
        return this.jwt.verify(jwtToken, this._appConfig.JWT_SECRET_KEY);
     }catch(e){
        console.log('e:',e);
        return null;
     }
  }
  
}

export default AuthService;