
import { VerifyRequest } from "@models/verify/request";
import { VerifyBVNResponsePayload, VerifyResponse } from "@models/verify/response";
import { EnvConstants } from "@services/implementation/common/env.constants";
import UtilService from "@services/implementation/common/util";
import { route, POST } from "awilix-express";
import axios, { AxiosResponse } from "axios";
import { VerifyVerificationStatus } from "server/enums/verify/verification-status";
import { VerifyVerificationType } from "server/enums/verify/verification-type";
import RedisMiddleware from "server/middleware/redis-middleware";
const { verify: { v3 } } = EnvConstants;
@route('/api/common')
export default class CommonController {
    constructor(private _utils: UtilService, private _redis: RedisMiddleware) {

    }

    instance = axios.create({
        method: 'post',
        baseURL: v3.baseUrl,
        timeout: 20000,
        headers: { 'Content-Type': 'application/json', 'apiKey': v3.bvnValidation.apiKey, 'userid': v3.bvnValidation.userId, 'mode': 'no-cors' },
    });

    @route('/validatebvn')
    @POST()
    validateBVN = async (req: any, res: any, next: any) => {
        // if(verifyRequest(req,"validatebvn")&&spamChecker(req.ip,"validatebvn")){
        const cacheKey = "bvnList";
        const bvnList: any = await this._redis.get(cacheKey, {});
        try {
            const endpoint = v3.bvnValidation.endpoint;
            const body: VerifyRequest =
            {
                "searchParameter": req.body.payload,
                "transactionReference": "",
                "verificationType": VerifyVerificationType.BVN
            }
            const key = body.searchParameter;
            if (!bvnList[key]) {

                let result = await this.instance.post<VerifyRequest, AxiosResponse<VerifyResponse<VerifyBVNResponsePayload>>>(endpoint, body);

                if (this._utils.hasValue(result.data) && result.data.responseCode == "00") {

                    bvnList[key] = result.data.response || VerifyVerificationStatus.NotVerified;
                }

                if (result.data.responseCode == "00" && result.data.verificationStatus == VerifyVerificationStatus.Verified) {

                    res.data = { message: "BVN Verified", data: key };
                    res.statusCode = 200;
                } else {
                    res.statusCode = 400;
                    res.data = { message: "BVN verification failed" };
                }
            } else {
                res.statusCode = (bvnList[key] === null || bvnList[key] == VerifyVerificationStatus.NotVerified) ? 400 : 200;
                res.data = { message: (bvnList[key] === null || bvnList[key] == VerifyVerificationStatus.NotVerified) ? "BVN Verification Failed" : "BVN Verified" };
            }
        }
        catch (err: any) {
            console.log(err);
            res.statusCode = 500;
            res.data = err;
        }

        await this._redis.save(cacheKey, bvnList);
        next();
    }

}