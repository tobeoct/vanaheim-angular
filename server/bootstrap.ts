import { asClass, InjectionMode, createContainer, asValue } from 'awilix';

import App from './app';
import AppConfig from "@config";
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
import { LoanService } from '@services/implementation/loan/loan-service';
import { LoanRequestLogService } from '@services/implementation/loan/loan-request-log-service';
import { DocumentRepository } from '@repository/implementation/document/document-repository';
import { LoanTypeRequirementRepository } from '@repository/implementation/loantyperequirement-repository';
import { CompanyRepository } from '@repository/implementation/company-repository';
import { EmploymentRepository } from '@repository/implementation/employment-repository';
import { NOKRepository } from '@repository/implementation/nok-repository';
import { ShareholderRepository } from '@repository/implementation/shareholder-repository';
import { CollateralRepository } from '@repository/implementation/collateral-repository';
import { AccountRepository } from '@repository/implementation/account-repository';
import { LoanRequestLogRepository } from '@repository/implementation/loan/loan-request-log-repository';
import DocumentService from '@services/implementation/document-service';
import { TemplateService } from '@services/implementation/common/template-service';
import db = require('server/db/models');
import { RepaymentService } from '@services/implementation/repayment-service';
import { InvestmentService } from '@services/implementation/investment/investment-service';
import { LoanTypeRequirementService } from '@services/implementation/loan/loan-type-requirement-service';
import { StaffRepository } from '@repository/implementation/staff-repository';
import { DisbursedLoanRepository } from '@repository/implementation/loan/disbursed-loan-repository';
import { RepaymentRepository } from '@repository/implementation/repayment-repository';
import { DisbursedLoanService } from '@services/implementation/loan/disbursed-loan-service';
import { Cloudinary } from '@services/implementation/image/cloudinary-service';
import { AWSService } from '@services/implementation/image/aws-service';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const webPush = require('web-push');
const {Op} = require('sequelize');
const moment = require('moment');
const md5 = require('md5');
const fs = require('fs');
const sanitizer = require('sanitizer');
const fsExtra = require('fs-extra');
var cloudinary = require('cloudinary').v2;
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
            cloudinary: asValue(cloudinary),
            _appConfig: asClass(AppConfig).singleton(),
            _db: asValue(db.default||db),
            jwt:asValue(jwt),
            webPush:asValue(webPush),
            bcrypt:asValue(bcrypt),
            Op:asValue(Op),
            md5:asValue(md5),
            moment:asValue(moment),
            fs:asValue(fs),
            fsExtra:asValue(fsExtra),
            sanitizer:asValue(sanitizer),
            expressSession: asValue(session),
            _session:asClass(SessionMiddleware).singleton(),
            _redis:asClass(RedisMiddleware).singleton(),
            _encryption:asClass(Encryption).singleton(),
            _deviceRepository: asClass(DeviceRepository).singleton(),
            _pushNotificationRepository: asClass(PushNotificationRepository).singleton(),
            _subscriptionRepository: asClass(SubscriptionRepository).singleton(),
            _loanRequestRepository: asClass(LoanRequestRepository).singleton(),
            _loanRequestLogRepository: asClass(LoanRequestLogRepository).singleton(),
            _documentRepository:asClass(DocumentRepository).singleton(),
            _companyRepository:asClass(CompanyRepository).singleton(),
            _employmentRepository:asClass(EmploymentRepository).singleton(),
            _nokRepository:asClass(NOKRepository).singleton(),
            _collateralRepository:asClass(CollateralRepository).singleton(),
            _shareholderRepository:asClass(ShareholderRepository).singleton(),
            _loanTypeRequirementRepository:asClass(LoanTypeRequirementRepository).singleton(),
            _clientRepository: asClass(ClientRepository).singleton(),
            _accountRepository: asClass(AccountRepository).singleton(),
            _staffRepository: asClass(StaffRepository).singleton(),
            _baseRepository: asClass(BaseRepository).singleton(),
            _userRepository: asClass(UserRepository).singleton(),
            _customerRepository: asClass(CustomerRepository).singleton(),
            _disbursedLoanRepository: asClass(DisbursedLoanRepository).singleton(),
            _repaymentRepository: asClass(RepaymentRepository).singleton(),
            _loanRequestService: asClass(LoanRequestService).singleton(),
            _repaymentService: asClass(RepaymentService).singleton(),
            _loanTypeRequirementService: asClass(LoanTypeRequirementService).singleton(),
            _loanRequestLogService: asClass(LoanRequestLogService).singleton(),
            _loanService: asClass(LoanService).singleton(),
            _disbursedLoanService: asClass(DisbursedLoanService).singleton(),
            _investmentService: asClass(InvestmentService).singleton(),
            _notificationService: asClass(NotificationService).singleton(),
            _clientService: asClass(ClientService).singleton(),
            _templateService: asClass(TemplateService).singleton(),
            _authService: asClass(AuthService).singleton(),
            _utilService: asClass(UtilService).singleton(),
            _userService: asClass(UserService).singleton(),
            _emailService: asClass(EmailService).singleton(),
            _documentService: asClass(DocumentService).singleton(),
            _cloudinaryService: asClass(Cloudinary).singleton(),
            _awsService: asClass(AWSService).singleton()
        });

        return container;
    }
}