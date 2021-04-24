import { asClass, InjectionMode, createContainer } from 'awilix';

import App from './app';
import AppConfig from '@config';
import { LoanRequestRepository } from '@repository/implementation/loan/loan-request-repository';
import { LoanRequestService } from '@services/implementation/loan/loan-request-service';

export default class Bootstrap {
    
    constructor() {

        this.instance = this._createContainer();
    }

    run(callback) {

        const app = this.instance.resolve('app');
        app.start(this.instance, callback);
    }

    _createContainer() {

        const container = createContainer({injectionMode: InjectionMode.CLASSIC});
    
        container.register({
            app: asClass(App).singleton(),
            appConfig: asClass(AppConfig).singleton(),
            loanRequestRepository: asClass(LoanRequestRepository).singleton(),
            loanRequestService: asClass(LoanRequestService).singleton()
        });

        return container;
    }
}