import { Send } from 'express-serve-static-core';
export interface TypedResponse<ResBody> extends Express.Response {
    json: Send<ResBody, this>;
 }

 export interface VanaheimTypedResponse<T> extends TypedResponse<T>{
     statusCode:number
     payload:VanaheimResponse<T>
 }

 export interface VanaheimResponse<T> {
    message?:string
    data?:T
}