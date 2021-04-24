// import bodyParser from 'body-parser';
// import compression from 'compression';
// import cors from 'cors';
// import express from 'express';

const http = require('http');
const https = require('https');
const express = require('express');
const serverless = require('serverless-http');
const compression = require('compression');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout')
const expAutoSan = require('express-autosanitizer');
const httpsRedirect = require('express-https-redirect');
const morgan = require('morgan')
const parseurl = require('parseurl');
const path = require('path');
const expressValidator = require('express-validator');
// const mustacheExpress = require('mustache-express');
// const uniqueValidator = require('mongoose-unique-validator');
// const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
// const app = express();
// const jsonParser = bodyParser.json({limit: '100mb'})
const { port} = require('@config');
const { clientApiKeyValidation, authorise} = require('@services/implementation/common/auth-service');
const { apiRouter } = require('@controllers/index.js');
const cookieParser = require('cookie-parser');
// This serves static files from the specified directory
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;
import { loadControllers, scopePerRequest } from 'awilix-express';

export default class App {

    constructor(appConfig) {

        this.appConfig = appConfig;
    }

    start(container, callback) {

        const app = this._create(container);
        const port = this.appConfig.port;

        app.listen(port, callback(port));
    }

    _create(container) {

        const app = express();

        // app.use(compression());
        // app.use(bodyParser.urlencoded({extended: false}));
        // app.use(bodyParser.json());
        // app.use(cors());
        
app.use(express.static('dist/vanaheim'));
app.use(morgan("combined"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(compression());
app.use(timeout('120s'));
app.use(expAutoSan.all)

        app.use(scopePerRequest(container));
        
const RedisStore = connectRedis(session)
//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})
redisClient.on('error', function (err:any) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err:any) {
    console.log('Connected to redis successfully');
});
app.use(cookieParser())
app.use(  session({
    store: new RedisStore({ client: redisClient }),
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: true, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60  * 60 * 10, // session max age in miliseconds
       
    }
}))

        app.use(loadControllers('api/**/*.controller.js', {cwd: __dirname}));

        
        return app;
    }
}