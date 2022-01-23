import { Send } from 'express-serve-static-core';
export interface TypedResponse<ResBody> extends Express.Response {
    json: Send<ResBody, this>;
 }

 export interface OrdenaTypedResponse<T> extends TypedResponse<T>{
     statusCode:number
     payload:OrdenaResponse<T>
 }

 export interface OrdenaResponse<T> {
    message?:string
    data?:T
}