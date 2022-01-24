import { Query } from 'express-serve-static-core';
export interface TypedRequest<T extends Query, U> extends Express.Request {
    body: U,
    query: T
}


export interface TypedRequestQuery<T extends Query> extends Express.Request {
    query: T
}

export interface TypedRequestBody<T> extends Express.Request {
    body: T
}
export interface DefaultRequest{
    ip:string;
    originalUrl:string;
    method:string;
    header:any;
}
export interface VanaheimQueryRequest<T extends Query> extends TypedRequestQuery<T>, DefaultRequest{
    
}

export interface VanaheimBodyRequest<T> extends TypedRequestBody<T>, DefaultRequest{
    
}
export interface VanaheimRequest<T  extends Query,U> extends TypedRequest<T,U>, DefaultRequest{
}