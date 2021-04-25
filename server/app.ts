// import bodyParser from 'body-parser';
// import compression from 'compression';
// import cors from 'cors';
// import express from 'express';

const http = require('http');
const https = require('https');
const express = require('express');
const serverless = require('serverless-http');
const compression = require('compression');
// const bodyParser = require('body-parser');
const timeout = require('connect-timeout')
const expAutoSan = require('express-autosanitizer');
const httpsRedirect = require('express-https-redirect');
const morgan = require('morgan')
const parseurl = require('parseurl');
const path = require('path');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
// This serves static files from the specified directory
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;
import AppConfig from '@config';
import { inject, loadControllers, scopePerRequest } from 'awilix-express';
import {authoriseRequest,clientApiKeyValidation,authoriseResponse,sessionRequestAuthorisation,sessionResponseAuthorisation} from './middleware/authorise-middleware';
import SessionMiddleware from './middleware/session-middleware';

export default class App {
   
    constructor(private _appConfig: AppConfig,private _session:SessionMiddleware) {
    }

    start(container:any, callback:any) {

        const app = this._create(container);
        const port = this._appConfig.port;

        app.listen(port, callback(port));
    }
    errorHandler (err:any, req:any, res:any, next:any) {
        if(err){
        // res.status(500).send();
        res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      // render the error page
        console.log(err);
      res.status(err.status || 500).send();
      // res.render('error');
        }
        // res.render('error', { error: err })
      }
      
    _create(container:any) {

        const app = express();
        app.use(express.static('dist/vanaheim'));
        app.use(morgan("combined"))
        app.use(express.json({limit: '100mb'}))
        app.use(express.urlencoded({extended: true}))
        app.use(compression());
        app.use(timeout('120s'));
        app.use(expAutoSan.all)

        app.use(scopePerRequest(container));
        
      
        app.use(cookieParser())
        app.use(this._session.getSession())
        app.use(inject(sessionRequestAuthorisation))
        app.use("/api",inject(clientApiKeyValidation),inject(authoriseRequest))
        app.use(loadControllers('api/controllers/*.controller.ts', {cwd: __dirname}));
        app.use("/api",inject(authoriseResponse))

        app.get('*', function(req:any, res:any) {
          console.log( req.session)
          res.sendFile('dist/vanaheim/index.html',{ root: path.resolve(__dirname, '../')  })
        })
        
        app.use(inject(sessionResponseAuthorisation))
        app.use(this.errorHandler);
        
       
        
        return app;
    }
}