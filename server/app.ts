
const cors = require('cors');

const http = require('http');
const https = require('https');
const express = require('express'),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

import "reflect-metadata";
import * as swagger from "swagger-express-ts";
const enforce = require('express-sslify');
const compression = require('compression');
const timeout = require('connect-timeout')
const expAutoSan = require('express-autosanitizer');
const httpsRedirect = require('express-https-redirect');
const morgan = require('morgan')
const path = require('path');

const cookieParser = require('cookie-parser');
// This serves static files from the specified directory
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;
import AppConfig from 'server/config';
import { AWSService } from '@services/implementation/image/aws-service';
import { inject, loadControllers, scopePerRequest } from 'awilix-express';
import helmet = require('helmet');
import { authoriseRequest, clientApiKeyValidation, authoriseResponse, sessionRequestAuthorisation, sessionResponseAuthorisation } from './middleware/authorise-middleware';
import SessionMiddleware from './middleware/session-middleware';
import { Environment } from '@enums/environment';
import { SwaggerDefinitionConstant } from "swagger-express-ts";

const publicVapidKey = 'BH9z7PCyti1n9ItSnlp_8qoyDHP-RUK-vdZrTCqaoYHKVKIlk2w3XPoZLSndWp23VPVepP7gZ6diOFTbQNLpeBc';
const privateVapidKey = '_qHAcJ81LwWefymI1DnHmmeF6ZBqEeTmfXPFebOAGrM';
export default class App {
  SWAGGER_OPTIONS: any
  SWAGGER_OPTIONS2: any
  constructor(private _appConfig: AppConfig, private _session: SessionMiddleware, private webPush: any, private _awsService: AWSService) {
    this.SWAGGER_OPTIONS = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Vanaheim API Docs Swagger",
          version: "0.1.0",
          description:
            "This is a simple CRUD API application made with Express and documented with Swagger for Vanaheim",
          license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html",
          },
          contact: {
            name: "Vanir Capital",
            url: "https://vanircapital.org",
            email: "support@vanircapital.org",
          },
        },
        servers: [
          {
            url: `${_appConfig.WEBURL}`,
          },
        ],
      },
      apis: ["./controllers/account.controller.ts"],
    };

    this.SWAGGER_OPTIONS2 = {
      definition: {
        info: {
          title: "Vanaheim API Docs Swagger",
          version: "1.0"
        },
        externalDocs: {
          url: "https://app.vanircapital.org"
        },
        models: {
          Account: {
            properties: {
              id: {
                type: SwaggerDefinitionConstant.Model.Property.Type.NUMBER,
                required: true
              },
              customerID: {
                type: SwaggerDefinitionConstant.Model.Property.Type.NUMBER,
                required: true
              },
              bank: {
                type: SwaggerDefinitionConstant.Model.Property.Type.STRING
              },
              name: {
                type: SwaggerDefinitionConstant.Model.Property.Type.STRING
              },
              number: {
                type: SwaggerDefinitionConstant.Model.Property.Type.STRING
              }
            }
          }
        },
        definition: {

          securityDefinitions: {
            basicAuth: {
              type: SwaggerDefinitionConstant.Security.Type.BASIC_AUTHENTICATION
            },
            apiKeyHeader: {
              type: SwaggerDefinitionConstant.Security.Type.API_KEY,
              in: SwaggerDefinitionConstant.Security.In.HEADER,
              name: "api_key"
            }
          }
        }
      }
    }
  }

  start(container: any, callback: any) {

    const app = this._create(container);
    const port = this._appConfig.port;

    app.listen(port, callback(port));
  }
  errorHandler(err: any, req: any, res: any, next: any) {
    if (err) {
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

  _create(container: any) {
    let _this = this;
    const app = express();
    // app.use(helmet({
    //   contentSecurityPolicy: false,
    // }))
    // app.use(helmet.contentSecurityPolicy());
    if (this._appConfig.environment == Environment.Production) {
      //enforce redirect from http to https on production
      app.use(enforce.HTTPS({ trustProtoHeader: true }));
    }
    app.use(helmet.dnsPrefetchControl());
    // app.use(helmet.expectCt());
    app.use(helmet.frameguard());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.hsts());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    // app.use(helmet.permittedCrossDomainPolicies());
    // app.use(helmet.referrerPolicy());
    app.use(helmet.xssFilter());
    app.use(compression());


    app.use(express.static('dist/vanaheim'));
    app.use(morgan("combined"))

    app.use(express.json({ limit: '20mb' }))
    app.use(express.urlencoded({ extended: true }))
    app.use(timeout('180s'));
    app.use(expAutoSan.all)
    app.use(cors())
    app.use(scopePerRequest(container));


    app.use(cookieParser())

    this.webPush.setVapidDetails('mailto:sender@example.com', publicVapidKey, privateVapidKey);
    app.use(httpsRedirect())




    app.use(this._session.getSession())
    app.use(inject(sessionRequestAuthorisation))
    app.use("/api", inject(clientApiKeyValidation), inject(authoriseRequest), expAutoSan.route)
    console.log("App.TS", this._appConfig.environment)
    if (this._appConfig.environment == Environment.Production) {
      app.use(loadControllers('controllers/*.controller.js', { cwd: __dirname }));
    } else {
      app.use(loadControllers('controllers/*.controller.ts', { cwd: __dirname }));
    }

    app.use('/api-docs/swagger', express.static('swagger'));
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    app.use(swagger.express(this.SWAGGER_OPTIONS2));
    const specs = swaggerJsdoc(this.SWAGGER_OPTIONS);
    app.use(
      "/swagger",
      swaggerUi.serve,
      swaggerUi.setup(specs, { explorer: true })
    );
    app.use("/api", inject(authoriseResponse))

    app.get('*', function (req: any, res: any) {
      res.setHeader('Cache-Control', 'public, max-age=5000');
      let p = _this._appConfig.environment == Environment.Production ? "" : "dist/";
      let b = _this._appConfig.environment == Environment.Production ? "../" : "../";
      // // ,{ root: path.resolve(__dirname, b)  }p+
      res.sendFile('index.html', { root: path.resolve("dist/vanaheim") });
    })

    app.use(inject(sessionResponseAuthorisation))


    app.use(this.errorHandler);



    return app;
  }
}