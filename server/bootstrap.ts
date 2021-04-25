import { asClass, InjectionMode, createContainer, asValue } from 'awilix';

import App from './app';
import AppConfig from "@config"
import { LoanRequestRepository } from '@repository/implementation/loan/loan-request-repository';
import { LoanRequestService } from '@services/implementation/loan/loan-request-service';
import ClientService from '@services/implementation/client-service';
import AuthService from '@services/implementation/auth-service';
import UserService from '@services/implementation/user-service';
import  UtilService  from '@services/implementation/common/util';
import EmailService from '@services/implementation/common/email-service';
import session = require('express-session');
import SessionMiddleware from './middleware/session-middleware';
import RedisMiddleware from './middleware/redis-middleware';
export default class Bootstrap {
    instance:any
    constructor() {

        this.instance = this._createContainer();
    }

    run(callback:any) {

        const app = this.instance.resolve('app');
        app.start(this.instance, callback);
    }

    _createContainer() {

        const container = createContainer({injectionMode: InjectionMode.CLASSIC});
    
        container.register({
            app: asClass(App).singleton(),
            _appConfig: asClass(AppConfig).singleton(),
            _db: asClass(AppConfig).singleton(),
            _loanRequestRepository: asClass(LoanRequestRepository).singleton(),
            _loanRequestService: asClass(LoanRequestService).singleton(),
            _clientService: asClass(ClientService).singleton(),
            _authService: asClass(AuthService).singleton(),
            _utilService: asClass(UtilService).singleton(),
            _userService: asClass(UserService).singleton(),
            _emailService: asClass(EmailService).singleton(),
            expressSession: asValue(session),
            _session:asClass(SessionMiddleware).singleton(),
            _redis:asClass(RedisMiddleware).singleton()
        });

        return container;
    }
}