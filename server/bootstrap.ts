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
import { BaseRepository } from '@repository/implementation/base-repository';
import { ClientRepository } from '@repository/implementation/client-repository';
import { UserRepository } from '@repository/implementation/user-repository';
import { CustomerRepository } from '@repository/implementation/customer-repository';
import Encryption from '@services/implementation/common/encryption-service';
import { DeviceRepository } from '@repository/implementation/device-repository';
import { PushNotificationRepository } from '@repository/implementation/pushnotification-repository';
import { SubscriptionRepository } from '@repository/implementation/subscription-repository';
import NotificationService from '@services/implementation/notification-service';
const db = require('@db/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const webPush = require('web-push');
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
            _db: asValue(db),
            jwt:asValue(jwt),
            webPush:asValue(webPush),
            bcrypt:asValue(bcrypt),
            expressSession: asValue(session),
            _session:asClass(SessionMiddleware).singleton(),
            _redis:asClass(RedisMiddleware).singleton(),
            _encryption:asClass(Encryption).singleton(),
            _deviceRepository: asClass(DeviceRepository).singleton(),
            _pushNotificationRepository: asClass(PushNotificationRepository).singleton(),
            _subscriptionRepository: asClass(SubscriptionRepository).singleton(),
            _loanRequestRepository: asClass(LoanRequestRepository).singleton(),
            _clientRepository: asClass(ClientRepository).singleton(),
            _baseRepository: asClass(BaseRepository).singleton(),
            _userRepository: asClass(UserRepository).singleton(),
            _customerRepository: asClass(CustomerRepository).singleton(),
            _loanRequestService: asClass(LoanRequestService).singleton(),
            _notificationService: asClass(NotificationService).singleton(),
            _clientService: asClass(ClientService).singleton(),
            _authService: asClass(AuthService).singleton(),
            _utilService: asClass(UtilService).singleton(),
            _userService: asClass(UserService).singleton(),
            _emailService: asClass(EmailService).singleton(),
        });

        return container;
    }
}