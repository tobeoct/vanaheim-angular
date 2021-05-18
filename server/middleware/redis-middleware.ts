
const redis = require('redis');
const connectRedis = require('connect-redis');

export default class RedisMiddleware{
    RedisStore:any
    RedisClient:any
    constructor(private expressSession:any){
        this.connect();
        this.listen();
    }
private connect=()=>{
    const connector = connectRedis(this.expressSession)
    //Configure redis client
    let config = process.env.NODE_ENV=="production"?{url:process.env.REDIS_URL}:{
        host: 'localhost',
        port: 6379
    }
     this.RedisClient = redis.createClient(config);
    this.RedisStore = new connector({ client: this.RedisClient })
}

private listen=()=>{
    this.RedisClient.on('error', function (err:any) {
        console.log('Could not establish a connection with redis. ' + err);
    });
    this.RedisClient.on('connect', function (err:any) {
        console.log('Connected to redis successfully');
    });
}

getRedisStore(){
    return this.RedisStore
}
}