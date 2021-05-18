import { IAuthService } from "@services/interfaces/Iauth-service";
const SECRET_KEY = "SECRET_KEY";;
import { newSessionRoutes, authRoutes } from "./common/routes";
class AuthService implements IAuthService{
  
  constructor(private jwt:any){

  }
  isNewTokenRequired = (httpMethod:any, url:any) => {
    for (let routeObj of newSessionRoutes) {
      if (routeObj.method === httpMethod && routeObj.path === url) {
        return true;
      }
    }
  return false;
  }
    isAuthRequired = (httpMethod:any, url:any) => {
    for (let routeObj of authRoutes) {
      if (routeObj.method === httpMethod && routeObj.path === url) {
        return true;
      }
    }
    return false;
  }
    generateJWTToken = (userData:any) =>{
     return this.jwt.sign(userData, SECRET_KEY, {
  
      expiresIn: '2m' // expires in 365 days
  
  });
  }
    verifyToken = (jwtToken:any) =>{
     try{
       console.log("Verifying Token", jwtToken)
        return this.jwt.verify(jwtToken, SECRET_KEY);
     }catch(e){
        console.log('e:',e);
        return null;
     }
  }
  
}

export default AuthService;