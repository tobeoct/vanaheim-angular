


import { authRoutes } from '@services/implementation/common/routes';
import { IAuthService } from '@services/interfaces/Iauth-service';
import { IClientService } from '@services/interfaces/Iclient-service';
import moment = require('moment');

const SECRET_KEY = "JWT_SECRET";

// class AuthoriseMiddleware {

//     constructor(private _authService:IAuthService, private _clientService:IClientService){

//     }
// }

// export default AuthoriseMiddleware;



export function clientApiKeyValidation (_clientService:IClientService){

  return async (req:any,res:any,next:any) => {
    console.log("clientApiKeyValidation")
     let clientApiKey = req.get('api_key');
  if(!clientApiKey){
        return res.status(400).send({
           status:false,
           response:"Missing Api Key"
        });
     }
  try {
        let clientDetails = await _clientService.getClientDetails(clientApiKey);
        if (clientDetails) {
            // console.log("Gotten Client Details", clientDetails)
           next();
        }
     } catch (e) {
        console.log('%%%%%%%% error :', e);
        return res.status(400).send({
           status: false,
           response: "Invalid Api Key"
        });
     }
  }
  }
  
  
  export function sessionRequestAuthorisation(_authService:IAuthService){
    return async (req:any, res:any, next:any) => {
      var apiUrl = req.originalUrl;
      var httpMethod = req.method;
      console.log("SESSION REQUEST",apiUrl,req.session)
      console.log("COOKIES", req.cookies, req.signedCookies)
      if(_authService.isNewTokenRequired(httpMethod, apiUrl)||_authService.isAuthRequired(httpMethod, apiUrl)){
        console.log("Forward to controller")
        next();
      }
      else{
        if(req.session & req.session.userData){
          // User is logged in
          if(apiUrl.includes("/welcome/")||apiUrl.includes("/auth/")){
            const userCategory = req.session.userData.category;
            if(userCategory && userCategory ==="admin"){
              res.redirect("/admin/requests");
            }else{
              res.redirect("/my/dashboard");
            }
          }
          else{
          next();
          }
        }
        else{
          //User is logged out
          if(apiUrl.includes("/welcome/")||apiUrl.includes("/auth/login")||apiUrl.includes("/auth/register")){
            next()
          }else{
          res.redirect("/auth/login");
          }
        }
      }
    }
  }
  export function sessionResponseAuthorisation(){
    return async (req:any, res:any, next:any) => {
      
      var apiUrl = req.originalUrl;
      var httpMethod = req.method;
      console.log("SESSION RESPONSE",apiUrl,req.session)
      if(req.session && req.session.cookie){
        const tokenExpirationDate = req.session.cookie.originalMaxAge;
        res.setHeader('expires-in',tokenExpirationDate);
              res.data['expires-in'] = tokenExpirationDate;
      }else{
        console.log("Session Response Unauthorised")
      }
  
      // console.log(req.cookies, req.signedCookies)
      res.status(res.statusCode || 200)
      .send({ status: true, response:res.data });
    }
  
  }
  export function authoriseRequest(_authService:IAuthService){
      return async (req:any, res:any, next:any) => {
        console.log("authoriseRequest")
          var apiUrl = req.originalUrl;
          var httpMethod = req.method;
          // req.session = {};
          
          if ( _authService.isNewTokenRequired(httpMethod, apiUrl)) {
              console.log("New Token Required")
            req.newTokenRequired = true;
           
          } 
          else if (_authService.isAuthRequired(httpMethod, apiUrl)) {
              console.log("Authorisation Required", apiUrl, req.header)
            let authHeader = req.header('Authorization');
            if(!authHeader) {
              return res.status(401).send({
                ok: false,
                error: {
                  reason: "Unauthorised",
                  code: 401
                }
              });
            }
            let jwtTokenID = authHeader.split(' ')[1];
         if (jwtTokenID && req.session.userData) {
              let userData:any = _authService.verifyToken(jwtTokenID);
              if (userData) {
                console.log("Verified Token", userData)
                req.session.userData = userData;
                // req.session.sessionID = jwtTokenID;
              }
              else {
                return res.status(401).send({
                  ok: false,
                  error: {
                    reason: "Invalid Token",
                    code: 401
                  }
                });
              }
            } else {
              return res.status(401).send({
                ok: false,
                error: {
                  reason: "Missing Token",
                  code: 401
                }
              });
            }
          }
          next();
         }
  }
  
   export const authoriseResponse=(_authService:IAuthService)=>{
  
      return async (req:any, res:any, next:any) => {
        console.log("Authorise Response")
          if (res.data==undefined) {
            return res.status(404).send({
              status: false,
              error: {
                reason: "Invalid Endpoint",
                code: 404
              }
            });
          }
  
        console.log("API Authorising Response", res.data)
        
          var apiUrl = req.originalUrl;
          var httpMethod = req.method;
          console.log("AUTH RESPONSE",apiUrl,req.session)
          if(req.session && req.session.cookie && _authService.isNewTokenRequired(httpMethod, apiUrl)){
            const tokenExpirationDate = req.session.cookie.originalMaxAge;
            res.setHeader('expires-in',tokenExpirationDate);
                  res.data['expires-in'] = tokenExpirationDate;
          }else{
            console.log("API Response Unauthorised")
          }
      
          // console.log(req.cookies, req.signedCookies)
          if(res.statusCode ==200){
          res.status(res.statusCode || 200)
          .send({ status: true, response:res.data});
          }else{
            res.status(res.statusCode || 400)
            .send(res.data);
          }
        
        }
  }