import AppConfig from "server/config"
import RedisMiddleware from "./redis-middleware"


export default class SessionMiddleware{
   constructor(private expressSession:any, private _redis:RedisMiddleware,private _appConfig:AppConfig){
    // console.log("Session Middleware",expressSession)
   }
    getSession=()=>{
        // console.log("Session Middleware",this.expressSession)
        return this.expressSession({
                store: this._redis.getRedisStore(),
                secret: this._appConfig.SESSION_SECRET_KEY,
                resave: true,
                saveUninitialized: true,
                cookie: {
                    secure: false, // if true only transmit cookie over https
                    httpOnly: true, // if true prevent client side JS from reading the cookie 
                    maxAge: 1000 * 60 *5 *12 //* 60 * 10, 300 // session max age in miliseconds
                }
            })
        
    }
}