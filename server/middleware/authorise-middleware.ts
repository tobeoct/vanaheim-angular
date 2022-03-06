


import { VanaheimRequest } from '@models/express/request';
import { IAuthService } from '@services/interfaces/Iauth-service';
import { IClientService } from '@services/interfaces/Iclient-service';


export function clientApiKeyValidation(_clientService: IClientService) {

  return async (req: any, res: any, next: any) => {
    console.log("clientApiKeyValidation")
    let clientApiKey = req.get('api_key');
    if (!clientApiKey) {
      return res.status(400).send({
        status: false,
        response: "Missing Api Key"
      });
    }
    try {
      let clientDetails = await _clientService.getClientDetails(clientApiKey);
      if (clientDetails) {
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


export function sessionRequestAuthorisation(_authService: IAuthService) {
  return async (req:VanaheimRequest<any, any>, res: any, next: any) => {
    let apiUrl = req.originalUrl;
    let httpMethod = req.method;
    // console.log("SESSION REQUEST", apiUrl, req.session)
    if (_authService.isNewTokenRequired(httpMethod, apiUrl) || _authService.isAuthRequired(httpMethod, apiUrl)) {
      console.log("Forward to controller")
      next();
    }
    else {
      if (req.session && req.session.userData) {
        // User is logged in
        if (apiUrl.includes("/welcome/") || apiUrl.includes("/auth/")) {
          const userCategory = req.session.userData.category;
          if (userCategory && userCategory === "admin") {
            res.redirect("/admin/requests");
          } else {
            res.redirect("/my/dashboard");
          }
        }
        else {
          next();
        }
      }
      else {
        //User is logged out
        if (apiUrl.includes("/admin") || apiUrl.includes("/welcome/") || apiUrl.includes("/auth/login") || apiUrl.includes("/auth/register")) {
          next()
        } else {
          res.redirect("/auth/login");
        }
      }
    }
  }
}
export function sessionResponseAuthorisation() {
  return async (req: VanaheimRequest<any,any>, res: any) => {

    let apiUrl = req.originalUrl;
    // console.log("SESSION RESPONSE", apiUrl, req.session)
    if (req.session && req.session.cookie) {
      const tokenExpirationDate = req.session.cookie.originalMaxAge;
      res.setHeader('expires-in', tokenExpirationDate);
      // res.data['expires-in'] = tokenExpirationDate;

      if (!res.payload.data) res.payload.data = {}
      if (res.payload.data instanceof Object) res.payload.data['expires-in'] = tokenExpirationDate;
    } else {
      console.log("Session Response Unauthorised")
    }

    res.status(res.statusCode || 200)
      .send({ status: true, response: res.payload?.data ?? res.payload?.message ?? res.payload });
  }

}
export function authoriseRequest(_authService: IAuthService) {
  return async (req: VanaheimRequest<any,any>, res: any, next: any) => {
    console.log("authoriseRequest")
    let apiUrl = req.originalUrl;
    let httpMethod = req.method;
    // req.session = {};
    if (_authService.isNewTokenRequired(httpMethod, apiUrl)) {
      console.log("New Token Required")
      req.session.newTokenRequired = true;

    }
    else if (_authService.isAuthRequired(httpMethod, apiUrl)) {
      // console.log("Authorisation Required", apiUrl, req.header)
      let authHeader = req.header('Authorization');
      if (!authHeader) {
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
        let userData: any = _authService.verifyToken(jwtTokenID);
        if (userData) {
          // console.log("Verified Token", userData)
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

export const authoriseResponse = (_authService: IAuthService) => {

  return async (req: VanaheimRequest<any,any>, res: any) => {
    console.log("Authorise Response")
    if (res.payload == undefined) {
      console.log("Authorise Response: No Data")
      return res.status(404).send({
        status: false,
        error: {
          reason: "Invalid Endpoint",
          code: 404
        }
      });
    }

    let apiUrl = req.originalUrl;
    let httpMethod = req.method;
    if (req.session && req.session.cookie && _authService.isNewTokenRequired(httpMethod, apiUrl)) {
      const tokenExpirationDate = req.session.cookie.originalMaxAge;
      res.setHeader('expires-in', tokenExpirationDate);
      if (!res.payload.data) res.payload.data = {}
      if (res.payload.data instanceof Object) res.payload.data['expires-in'] = tokenExpirationDate;
    }

    // if (res.statusCode == 200) {
    //   res.status(res.statusCode || 200)
    //     .send({ status: true, response: res.data });
    // } else {
    //   res.status(res.statusCode || 400)
    //     .send(res.data);
    // }
  // console.log(req.cookies, req.signedCookies)
  if (res.statusCode == 200) {
    res.status(200)
      .send({ status: true, response: res.payload?.data ?? res.payload?.message ?? res.payload });
  } else {
    res.status(400)
      .send({ status: false, message: res.payload?.message });
  }
  }
}