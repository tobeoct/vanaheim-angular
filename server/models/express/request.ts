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
    originalUrl:string;
    method:string;
    header:any;
}
export interface OrdenaQueryRequest<T extends Query> extends TypedRequestQuery<T>, DefaultRequest{
    
}

export interface OrdenaBodyRequest<T> extends TypedRequestBody<T>, DefaultRequest{
    
}
export interface OrdenaRequest<T  extends Query,U> extends TypedRequest<T,U>, DefaultRequest{
}