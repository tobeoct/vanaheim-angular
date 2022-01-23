import AppConfig, { Environment } from "server/config";
import { promisify } from "util";
const redis = require('redis');
const connectRedis = require('connect-redis');

export default class RedisMiddleware {
    RedisStore: any
    RedisClient: any
    getAsync: (key: string, callback?: any) => Promise<any>;
    setAsync: (key: string, value: string, callback?: any) => Promise<any>;
    constructor(private expressSession: any, private _appConfig: AppConfig) {
        this.connect();
        this.listen();
        this.getAsync = promisify(this.RedisClient.get).bind(this.RedisClient);
        this.setAsync = promisify(this.RedisClient.set).bind(this.RedisClient);
    }
    private connect = () => {
        const connector = connectRedis(this.expressSession)
        //Configure redis client
        let config = this._appConfig.environment ==Environment.production ? { url: process.env.REDIS_URL } :
            {
                host: 'localhost',
                port: 6379
            }
        this.RedisClient = redis.createClient(config);
        this.RedisStore = new connector({ client: this.RedisClient })
    }

    private listen = () => {
        this.RedisClient.on('error', function (err: any) {
            console.log('Could not establish a connection with redis. ' + err);
        });
        this.RedisClient.on('connect', function (err: any) {
            console.log('Connected to redis successfully');
        });
    }

    getRedisStore() {
        return this.RedisStore
    }

    save = (key: string, value: object) => new Promise(async (resolve, reject) => {
        let reply = await this.setAsync(key, JSON.stringify(value));
        resolve(reply);
    })

    get = (key: string, defaultValue = {}) => new Promise(async (resolve, reject) => {
        let reply = await this.getAsync(key);
        if (reply) {
            resolve(JSON.parse(reply))
        } else {
            this.save(key, defaultValue);
            resolve(defaultValue);
        }
    })
}