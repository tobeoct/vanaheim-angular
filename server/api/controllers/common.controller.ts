
import { route, POST } from "awilix-express";
import axios from "axios";
import RedisMiddleware from "server/middleware/redis-middleware";

@route('/api/common')
export default class CommonController {
constructor(private _redis:RedisMiddleware){

}
    
instance = axios.create({
    method: 'post',
    baseURL: 'https://app.verified.ng',
    timeout: 20000,
    headers: {'Content-Type': 'application/json','apiKey': "zeb'V8U*-h*e-jO'",'userid':'1543318849803','mode': 'no-cors'},
  });

    @route('/validatebvn')
    @POST()
    validateBVN =async (req:any, res:any,next:any) => {
    // if(verifyRequest(req,"validatebvn")&&spamChecker(req.ip,"validatebvn")){
        let key = "bvnList";
        let bvnList:any = await this._redis.get(key,{});
     try {
        let url = '/bvn-service/api/svalidate/wrapper';
        let body = { email: req.session?.userData?.email||'support@vanircapital.org', bvn: req.body.payload };
        if(bvnList[body.bvn]===undefined){
            let result = await this.instance.post(url, body); 
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