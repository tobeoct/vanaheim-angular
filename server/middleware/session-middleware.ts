import AppConfig from "@config"
import RedisMiddleware from "./redis-middleware"


export default class SessionMiddleware{
   constructor(private expressSession:any, private _redis:RedisMiddleware,private _appConfig:AppConfig){
    console.log("Session Middleware",expressSession)
   }
    getSession=()=>{
        return this.expressSession({
                store: this._redis.getRedisStore(),
                secret: this._appConfig.SECRET_KEY,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    secure: false, // if true only transmit cookie over https
                    httpOnly: true, // if true prevent client side JS from reading the cookie 
                    maxAge: 1000 * 60  * 60 * 10, // session max age in miliseconds
                }
            })
        
    }
}