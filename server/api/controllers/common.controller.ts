
import { EnvConstants } from "@services/implementation/common/env.constants";
import { route, POST } from "awilix-express";
import axios from "axios";
import RedisMiddleware from "server/middleware/redis-middleware";
const {verify:{v2}} = EnvConstants;
@route('/api/common')
export default class CommonController {
constructor(private _redis:RedisMiddleware){

}
    
instance = axios.create({
    method: 'post',
    baseURL: v2.baseUrl,
    timeout: 20000,
    headers: {'Content-Type': 'application/json','apiKey': v2.bvnValidation.apiKey,'userid':v2.bvnValidation.userId,'mode': 'no-cors'},
  });

    @route('/validatebvn')
    @POST()
    validateBVN =async (req:any, res:any,next:any) => {
    // if(verifyRequest(req,"validatebvn")&&spamChecker(req.ip,"validatebvn")){
        let key = "bvnList";
        let bvnList:any = await this._redis.get(key,{});
     try {
        let endpoint = v2.bvnValidation.endpoint;
        let body = { email: req.session?.userData?.email||'support@vanircapital.org', bvn: req.body.payload };
        if(bvnList[body.bvn]===undefined){
            let result = await this.instance.post(endpoint, body); 
            if (result.data["code"]&&result.data["code"]=="00") {
                bvnList[result.data["bvn"]] = result.data["basicDetails"];
                res.statusCode = 200;
                res.data = {message:"BVN Verified"};
            }
            else {
                if(result.data["code"]!="00") bvnList[body.bvn] =null;
                res.statusCode = 400;
                res.data = {message:"BVN verification failed"};
            }
        }else{
            res.statusCode = bvnList[body.bvn]===null?400: 200;
            res.data = { message: bvnList[body.bvn]===null?"BVN Verification Failed":"BVN Verified" };
        }
    }
    catch (err:any) {
        console.log(err);
        res.statusCode = 500;
        res.data = err;
    }

    await this._redis.save(key,bvnList);
    next();
  }

}