export interface IAuthService{
    isNewTokenRequired : (httpMethod:any, url:any) =>any;
    isAuthRequired : (httpMethod:any, url:any) =>any ;
    generateJWTToken : (userData:any) =>any ;
    verifyToken :(jwtToken:any)=>any ;    
}