
import AppConfig from '@api/config';
import { Customer } from '@models/customer';
import { ApprovedEarningStatus } from '@models/helpers/enums/approvedEarningStatus';
import { EarningRequestStatus } from '@models/helpers/enums/investmentrequeststatus';
import { BaseStatus } from '@models/helpers/enums/status';
import { ApprovedEarning } from '@models/investment/approved-investment';
import { EarningLiquidation, LiquidationStatus } from '@models/investment/earnings-liquidation';
import { EarningTopUp, TopUpStatus } from '@models/investment/earnings-topup';
import { EarningRequest } from '@models/investment/investment-request';
import { EarningRequestLog } from '@models/investment/investment-request-log';
import { IApprovedEarningRepository } from '@repository/interface/investment/Iapproved-earning-repository';
import { IEarningLiquidationRepository } from '@repository/interface/investment/Iearning-liquidation-repository';
import { IEarningTopUpRepository } from '@repository/interface/investment/Iearning-topup-repository';
import EmailService, { EmailType } from '@services/implementation/common/email-service';
import { TemplateService } from '@services/implementation/common/template-service';
import UtilService from '@services/implementation/common/util';
import { IApprovedEarningService } from '@services/interfaces/investment/Iapproved-earning-service';
import { IEarningRequestLogService } from '@services/interfaces/investment/Iinvestment-log-request-service';
import { IEarningRequestService } from '@services/interfaces/investment/Iinvestment-request-service';
import { IEarningService } from '@services/interfaces/investment/Iinvestmentservice';
import { GET, PATCH, POST, route } from 'awilix-express';
import moment = require('moment');
@route('/api/earnings')
export default class EarningsController {

    constructor(private _earningService: IEarningService, private _earningTopUpRepository: IEarningTopUpRepository, private _earningLiquidationRepository: IEarningLiquidationRepository, private _approvedEarningRepository: IApprovedEarningRepository, private _appConfig: AppConfig, private _templateService: TemplateService, private _utils: UtilService, private _emailService: EmailService, private _approvedEarningService: IApprovedEarningService, private _earningRequestLogService: IEarningRequestLogService, private _earningRequestService: IEarningRequestService, private sanitizer: any) {

    }
    @route('/apply')
    @POST()
    apply = async (req: any, res: any, next: any) => {
        let response: any = await this._earningService.process(req.session.userData.customer, req.body);
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data;
        } else {
            res.statusCode = 400;
            res.data = response;
        }


        next()
    }

    @route('/getAllEarningRequests')
    @GET()
    getAllEarningRequests = async (req: any, res: any, next: any) => {
        console.log("Earnings Controller", req.session)
        let earningRequests = await this._earningService.getAllEarningRequests();
        res.statusCode = 200;
        res.data = earningRequests;

        next()

    }

    @route('/search')
    @POST()
    search = async (req: any, res: any, next: any) => {
        console.log("Searching Logs");
        let response: any = await this._earningRequestLogService.search(req.body, req.session.userData.customer);
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data
        } else {
            res.statusCode = 400;
            res.data = response;
        }

        next()
    }
    @route('/searchToProcess')
    @POST()
    searchForAdmin = async (req: any, res: any, next: any) => {
        console.log("Searching Logs");
        let response: any = await this._earningRequestService.search(req.body);
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data
        } else {
            res.statusCode = 400;
            res.data = response;
        }

        next()
    }
    @route('/getEarningDetails')
    @GET()
    getEarningDetails = async (req: any, res: any, next: any) => {
        const id = this.sanitizer.escape(req.query.id);
        let response: any = await this._earningService.getEarningDetails(id, "earningRequest");
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data
        } else {
            res.statusCode = 400;
            res.data = response;
        }

        next()
    }
    @route('/getEarningLogDetails')
    @GET()
    getEarningLogDetails = async (req: any, res: any, next: any) => {
        const id = this.sanitizer.escape(req.query.id);
        let response: any = await this._earningService.getEarningDetails(id, "earningRequestLog");
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data
        } else {
            res.statusCode = 400;
            res.data = response;
        }

        next()
    }

    @route('/getTopUps')
    @GET()
    topUps = async (req: any, res: any, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.id);
            const amount = this.sanitizer.escape(req.query.amount);
            const status = this.sanitizer.escape(req.query.status) ?? TopUpStatus.Pending;
            let response: any = !id ? await this._earningTopUpRepository.getByStatus(status) : await this._earningTopUpRepository.getByApprovedEarningID(id, amount);
            res.statusCode = 200;
            res.data = response

        } catch (ex) {
            res.statusCode = 400;
            res.data = "Sorry we could not process your requests";
        }

        next()
    }

    @route('/topUp')
    @PATCH()
    topUp = async (req: any, res: any, next: any) => {
        const id = this.sanitizer.escape(req.query.id);
        let response: any = await this._earningService.topUp(id);
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data
        } else {
            res.statusCode = 400;
            res.data = response;
        }

        next()
    }

    @route('/notifyTopUp')
    @GET()
    notifyTopUp = async (req: any, res: any, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.id);
            const amount = this._utils.convertToPlainNumber(this.sanitizer.escape(req.query.amount));
            let customer = req.session.userData?.customer as Customer;
            let earningRequest = await this._earningRequestService.getById(id);
            if (!earningRequest || Object.keys(earningRequest).length == 0) {
                res.statusCode = 400;
                res.data = "Cannot find request";
                next()
            }
            //Only one active top up is allowed
            if(earningRequest.requestStatus == EarningRequestStatus.TopUpRequest){
                res.statusCode = 400;
                res.data = "You currently have a Top Up request processing";
                next()
            }
            // earningRequest = (earningRequest as any).dataValues as EarningRequest;
            earningRequest.requestStatus = EarningRequestStatus.TopUpRequest;

            let earningRequestLog = await this._earningRequestLogService.getById(id);
            if (!earningRequestLog || Object.keys(earningRequestLog).length == 0) {
                res.statusCode = 400;
                res.data = "Cannot find request";
                next()
            }
            // earningRequestLog = (earningRequestLog as any).dataValues as EarningRequestLog;
            earningRequestLog.requestStatus = EarningRequestStatus.TopUpRequest;

            let approvedEarning = await this._approvedEarningRepository.getByRequestAndLogID(earningRequest.id, earningRequestLog.id);
            if (!approvedEarning || Object.keys(approvedEarning).length == 0) {
                res.statusCode = 400;
                res.data = "Cannot find request";
                next()
            }
            approvedEarning = (approvedEarning as any).dataValues as ApprovedEarning;

            //Only one active top up is allowed
            // const activeTopUps = await this._earningTopUpRepository.getActiveTopUps(approvedEarning.id);
            // if(activeTopUps.count>0){
            //     res.statusCode = 400;
            //     res.data = "You currently have a Top Up request processing";
            //     next()
            // }
            const earningTopUp = new EarningTopUp();
            earningTopUp.amount = amount;
            earningTopUp.code = this._utils.autogenerate({ prefix: "ETU" })
            earningTopUp.status = BaseStatus.Active;
            earningTopUp.topUpStatus = TopUpStatus.Pending;
            earningTopUp.duration =  moment(earningRequestLog.maturityDate).diff(moment().endOf("month"), "month")
            earningTopUp.approvedEarningID = approvedEarning.id;

            await this._earningTopUpRepository.create(earningTopUp);

            await this._earningRequestService.update(earningRequest);
            await this._earningRequestLogService.update(earningRequestLog);

            await this._emailService.SendEmail({ type: EmailType.Earning, to: customer?.email, html: this._templateService.EARNING_TOPUP_NOTIFICATION(customer?.firstName, earningRequest.code, this._utils.currencyFormatter(+amount)), toCustomer: true })

            await this._emailService.SendEmail({ type: EmailType.Earning, to: this._appConfig.INVESTMENT_EMAIL, html: `Customer ${customer.firstName} ${customer.lastName},<br/><br/> Requested for a top up on an earning with ID, ${earningRequest.code}`, toCustomer: false });

            res.statusCode = 200;
            res.data = "Our team has been notified successfully"

        } catch (ex) {
            console.log(ex)
            res.statusCode = 400;
            res.data = { status: false, data: "Sorry we could not notify our team, Kindly retry" };
        }
        next()
    }

    @route('/liquidate')
    @PATCH()
    liquidate = async (req: any, res: any, next: any) => {
        const id = this.sanitizer.escape(req.query.id);
        const status = this.sanitizer.escape(req.query.status);
        let response: any = await this._earningService.liquidate(id, status);
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data
        } else {
            res.statusCode = 400;
            res.data = response;
        }

        next()
    }

    @route('/getLiquidations')
    @GET()
    liquidations = async (req: any, res: any, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.id);
            const status = this.sanitizer.escape(req.query.status);
            let response: any = !id ? await this._earningLiquidationRepository.getByStatus(status) : await this._earningLiquidationRepository.getByApprovedEarningID(id)

            res.statusCode = 200;
            res.data = response

        } catch (ex) {
            res.statusCode = 400;
            res.data = "Sorry we could not process your requests";
        }
        next()
    }
    @route('/notifyLiquidation')
    @GET()
    notifyLiquidation = async (req: any, res: any, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.id);
            let customer = req.session.userData?.customer as Customer;

            let earningRequest = await this._earningRequestService.getById(id);
            if (!earningRequest || Object.keys(earningRequest).length == 0) {
                res.statusCode = 400;
                res.data = "Cannot find request";
                next()
            }
            // earningRequest = (earningRequest as any).dataValues as EarningRequest;
            earningRequest.requestStatus = EarningRequestStatus.LiquidationRequest;

            let earningRequestLog = await this._earningRequestLogService.getById(id);
            if (!earningRequestLog || Object.keys(earningRequestLog).length == 0) {
                res.statusCode = 400;
                res.data = { status: false,data:"Cannot find request"};
                next()
            }
            // earningRequestLog = (earningRequestLog as any).dataValues as EarningRequestLog;
            earningRequestLog.requestStatus = EarningRequestStatus.LiquidationRequest;

            let approvedEarning = await this._approvedEarningRepository.getByRequestAndLogID(earningRequest.id, earningRequestLog.id);
            if (!approvedEarning || Object.keys(approvedEarning).length == 0) {
                res.statusCode = 400;
                res.data = { status: false,data:"Cannot find request"};
                next()
            }
            approvedEarning = (approvedEarning as any).dataValues as ApprovedEarning;
            // approvedEarning.earningStatus = ApprovedEarningStatus.Pause;

            let earningLiquidation = await  this._earningLiquidationRepository.getByApprovedEarningID(approvedEarning.id);
            if (earningLiquidation && (Object.keys(earningLiquidation).length > 0 && (earningLiquidation as any).dataValues.liquidationStatus!=LiquidationStatus.Declined)) {
                res.statusCode = 400;
                res.data = { status: false,data:"Liquidation request currently processing"};
                next()
            }

            earningLiquidation = new EarningLiquidation();
            earningLiquidation.code = this._utils.autogenerate({ prefix: "ETU" })
            earningLiquidation.status = BaseStatus.Active;
            earningLiquidation.liquidationStatus = LiquidationStatus.Pending;
            earningLiquidation.duration = moment().diff(earningRequestLog.dateActive, "month");
            earningLiquidation.amount = (earningRequest.payout / earningRequest.duration) * earningLiquidation.duration;
            earningLiquidation.approvedEarningID = approvedEarning.id;

            if(earningLiquidation.amount==0){
                res.statusCode = 400;
                res.data = { status: false,data:"No Earning accrued to liquidate yet"};
                next();
                return
            }

            
            await this._earningLiquidationRepository.create(earningLiquidation);

            await this._earningRequestService.update(earningRequest);
            await this._earningRequestLogService.update(earningRequestLog);
            // await this._approvedEarningRepository.update(approvedEarning);
            await this._emailService.SendEmail({ type: EmailType.Earning, to: customer?.email, html: this._templateService.EARNING_LIQUIDATION_NOTIFICATION(customer?.firstName, earningRequest.code), toCustomer: true })

            await this._emailService.SendEmail({ type: EmailType.Earning, to: this._appConfig.INVESTMENT_EMAIL, html: `Customer ${customer.firstName} ${customer.lastName},<br/><br/> Requested for a liquidation on an earning with ID, ${earningRequest.code}`, toCustomer: false });
            res.statusCode = 200;
            res.data = "Our team has been notified successfully"

        } catch (ex) {
            res.statusCode = 400;
            res.data = { status: false, data: "Sorry we could not notify our team, Kindly retry" };
        }
        next()
    }
    @route('/getAllEarningDetails')
    @GET()
    getAllEarningDetails = async (req: any, res: any, next: any) => {
        // const id = this.sanitizer.escape(req.query.id);
        let response: any = await this._earningService.getAllEarningDetails(req.session.userData?.customer?.id, "earningRequest");
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data
        } else {
            res.statusCode = 400;
            res.data = response;
        }

        next()
    }
    @route('/getAllEarningLogDetails')
    @GET()
    getAllEarningLogDetails = async (req: any, res: any, next: any) => {
        const id = this.sanitizer.escape(req.query.id);
        let response: any = await this._earningService.getAllEarningDetails(req.session.userData?.customer?.id, "earningRequestLog");
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data
        } else {
            res.statusCode = 400;
            res.data = response;
        }

        next()
    }
    @route('/getApprovedEarning')
    @GET()
    getApprovedEarnings = async (req: any, res: any, next: any) => {
        const id = this.sanitizer.escape(req.query.requestId);
        let response: any = await this._approvedEarningService.getByEarningRequestId(id);
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data
        } else {
            res.statusCode = 400;
            res.data = response;
        }

        next()
    }
    @route('/updateStatus')
    @POST()
    updateStatus = async (req: any, res: any, next: any) => {
        let { status, id, failureReason, message,startDate } = req.body
        let response: any = await this._earningService.updateStatus({ requestStatus: status, id, failureReason, message,startDate });
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data
        } else {
            res.statusCode = 400;
            res.data = response;
        }

        next()
    }

    @route('/getLatestEarnings')
    @GET()
    getLatestEarning = async (req: any, res: any, next: any) => {
        console.log("Getting Latest Earning")
        let response: any = await this._earningRequestService.getLatestEarnings(req.session.userData);
        console.log("Gotten Latest Earning")
        if (response.status == true) {
            res.statusCode = 200;
            res.data = response.data;
        } else {
            res.statusCode = 400;
            res.data = response;
        }


        next()
    }

}