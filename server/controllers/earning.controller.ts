
import AppConfig from 'server/config';
import { EarningRequestStatus } from '@enums/investmentrequeststatus';
import { BaseStatus } from '@enums/status';
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
import { Customer } from '@entities/customer';
import { ApprovedEarning } from '@entities/investment/approved-investment';
import { EarningLiquidation } from '@entities/investment/earnings-liquidation';
import { EarningTopUp } from '@entities/investment/earnings-topup';
import { TopUpStatus } from '@enums/topUpStatus';
import { LiquidationStatus } from '@enums/liquidationStatus';
import { VanaheimBodyRequest, VanaheimQueryRequest } from '@models/express/request';
import { VanaheimTypedResponse } from '@models/express/response';
@route('/api/earnings')
export default class EarningsController {

    constructor(private _earningService: IEarningService, private _db: any, private _earningTopUpRepository: IEarningTopUpRepository, private _earningLiquidationRepository: IEarningLiquidationRepository, private _approvedEarningRepository: IApprovedEarningRepository, private _appConfig: AppConfig, private _templateService: TemplateService, private _utils: UtilService, private _emailService: EmailService, private _approvedEarningService: IApprovedEarningService, private _earningRequestLogService: IEarningRequestLogService, private _earningRequestService: IEarningRequestService, private sanitizer: any) {

    }
    @route('/apply')
    @POST()
    apply = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        let response: any = await this._earningService.process(req.session.userData.customer, req.body);
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data };
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }


        next()
    }

    @route('/getAllEarningRequests')
    @GET()
    getAllEarningRequests = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        console.log("Earnings Controller", req.session)
        let earningRequests = await this._earningService.getAllEarningRequests();
        res.statusCode = 200;
        res.payload = { data: earningRequests };

        next()

    }

    @route('/search')
    @POST()
    search = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        console.log("Searching Logs");
        let response: any = await this._earningRequestLogService.search(req.body, req.session.userData.customer);
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data }
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }

        next()
    }
    @route('/searchToProcess')
    @POST()
    searchForAdmin = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        console.log("Searching Logs");
        let response: any = await this._earningRequestService.search(req.body);
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data }
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }

        next()
    }
    @route('/getEarningDetails')
    @GET()
    getEarningDetails = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        const id = this.sanitizer.escape(req.query.id);
        let response: any = await this._earningService.getEarningDetails(id, "earningRequest");
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data }
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }

        next()
    }
    @route('/getEarningLogDetails')
    @GET()
    getEarningLogDetails = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        const id = this.sanitizer.escape(req.query.id);
        let response: any = await this._earningService.getEarningDetails(id, "earningRequestLog");
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data }
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }

        next()
    }

    @route('/getTopUps')
    @GET()
    topUps = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.id);
            const amount = this.sanitizer.escape(req.query.amount);
            const status = this.sanitizer.escape(req.query.status) ?? TopUpStatus.Pending;
            let response: any = !id ? await this._earningTopUpRepository.getByStatus(status, [{ model: this._db.Customer, required: false },{ model: this._db.ApprovedEarning, required: false }]) : await this._earningTopUpRepository.getByApprovedEarningID(id, amount, [{ model: this._db.Customer, required: false },{ model: this._db.ApprovedEarning, required: false }]);
            res.statusCode = 200;
            res.payload = { data: response }

        } catch (ex) {
            res.statusCode = 400;
            res.payload = { message: "Sorry we could not process your requests" };
        }

        next()
    }

    @route('/topUp')
    @PATCH()
    topUp = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        const id = this.sanitizer.escape(req.query.id);
        let response: any = await this._earningService.topUp(id);
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data }
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }

        next()
    }

    @route('/notifyTopUp')
    @GET()
    notifyTopUp = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.id);
            const amount = this._utils.convertToPlainNumber(this.sanitizer.escape(req.query.amount));
            let customer = req.session.userData?.customer as Customer;
            let earningRequest = await this._earningRequestService.getById(id);
            if (!earningRequest || Object.keys(earningRequest).length == 0) {
                res.statusCode = 400;
                res.payload = { message: "Cannot find request" };
                next()
                return;
            }
            //Only one active top up is allowed
            if (earningRequest?.requestStatus == EarningRequestStatus.TopUpRequest) {
                res.statusCode = 400;
                res.payload = { message: "You currently have a Top Up request processing" };
                next()
                return;
            }

            if (earningRequest?.requestStatus == EarningRequestStatus.Matured) {
                res.statusCode = 400;
                res.payload = { message: "Earning has matured, you cannot top it up" };
                next()
                return;
            }
            // earningRequest = (earningRequest as any).dataValues as EarningRequest;
            earningRequest.requestStatus = EarningRequestStatus.TopUpRequest;

            let earningRequestLog = await this._earningRequestLogService.getByEarningRequestIDAndRequestDate({ earningRequestID: id, requestDate: earningRequest.requestDate });
            if (!earningRequestLog || Object.keys(earningRequestLog).length == 0) {
                res.statusCode = 400;
                res.payload = { message: "Cannot find request" };
                next()
                return;
            }
            // earningRequestLog = (earningRequestLog as any).dataValues as EarningRequestLog;
            earningRequestLog.requestStatus = EarningRequestStatus.TopUpRequest;

            let approvedEarning = await this._approvedEarningRepository.getByRequestAndLogID(earningRequest.id, earningRequestLog.id);
            if (!approvedEarning || Object.keys(approvedEarning).length == 0) {
                res.statusCode = 400;
                res.payload = { message: "Cannot find request" };
                next()
                return;
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
            earningTopUp.customerID = customer.id;
            earningTopUp.amount = amount;
            earningTopUp.code = this._utils.autogenerate({ prefix: "ETU" })
            earningTopUp.status = BaseStatus.Active;
            earningTopUp.topUpStatus = TopUpStatus.Pending;
            earningTopUp.duration = moment(earningRequestLog.maturityDate).diff(moment().endOf("month"), "month")
            earningTopUp.approvedEarningID = approvedEarning.id;

            await this._earningTopUpRepository.create(earningTopUp);

            await this._earningRequestService.update(earningRequest);
            await this._earningRequestLogService.update(earningRequestLog);

            await this._emailService.SendEmail({ type: EmailType.Earning, to: customer?.email, html: this._templateService.EARNING_TOPUP_NOTIFICATION(customer?.firstName, earningRequest.requestId, this._utils.currencyFormatter(+amount)), toCustomer: true })

            await this._emailService.SendEmail({ type: EmailType.Earning, to: this._appConfig.INVESTMENT_EMAIL, html: `Customer ${customer.firstName} ${customer.lastName},<br/><br/> Requested for a top up on an earning with ID, ${earningRequest.requestId}`, toCustomer: false });

            res.statusCode = 200;
            res.payload = { message: "Our team has been notified successfully" }

        } catch (ex) {
            console.log(ex)
            res.statusCode = 400;
            res.payload = { message: "Sorry we could not notify our team, Kindly retry" };
        }
        next()
    }

    @route('/liquidate')
    @PATCH()
    liquidate = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        const id = this.sanitizer.escape(req.query.id);
        const status = this.sanitizer.escape(req.query.status);
        // const amount = this.sanitizer.escape(req.query.amount);
        // const payoutDate = this.sanitizer.escape(req.query.payoutDate);
        let response: any = await this._earningService.liquidate(id, status);
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data }
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }

        next()
    }

    @route('/getLiquidations')
    @GET()
    liquidations = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.id);
            const status = this.sanitizer.escape(req.query.status);
            let response: any = !id ? await this._earningLiquidationRepository.getByStatus(status, [{ model: this._db.Customer, required: false },{ model: this._db.ApprovedEarning, required: false }]) : await this._earningLiquidationRepository.getByApprovedEarningID(id, [{ model: this._db.Customer, required: false },{ model: this._db.ApprovedEarning, required: false }])

            res.statusCode = 200;
            res.payload = { data: response }

        } catch (ex) {
            res.statusCode = 400;
            res.payload = { message: "Sorry we could not process your requests" };
        }
        next()
    }
    @route('/notifyLiquidation')
    @GET()
    notifyLiquidation = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.id);
            const amount = this.sanitizer.escape(req.query.amount);
            const payoutDate = this.sanitizer.escape(req.query.payoutDate);
            let customer = req.session.userData?.customer as Customer;

            let earningRequest = await this._earningRequestService.getById(id);
            if (!earningRequest || Object.keys(earningRequest).length == 0) {
                res.statusCode = 400;
                res.payload = { message: "Cannot find request" };
                next()
                return;
            }
            // earningRequest = (earningRequest as any).dataValues as EarningRequest;
            earningRequest.requestStatus = EarningRequestStatus.LiquidationRequest;

            let earningRequestLog = await this._earningRequestLogService.getByEarningRequestIDAndRequestDate({ earningRequestID: id, requestDate: earningRequest.requestDate });
            if (!earningRequestLog || Object.keys(earningRequestLog).length == 0) {
                res.statusCode = 400;
                res.payload = { message: "Cannot find request" };
                next()
                return;
            }
            // earningRequestLog = (earningRequestLog as any).dataValues as EarningRequestLog;
            earningRequestLog.requestStatus = EarningRequestStatus.LiquidationRequest;

            let approvedEarning = await this._approvedEarningRepository.getByRequestAndLogID(earningRequest.id, earningRequestLog.id);
            if (!approvedEarning || Object.keys(approvedEarning).length == 0) {
                res.statusCode = 400;
                res.payload = { message: "Cannot find request" };
                next()
                return;
            }
            approvedEarning = (approvedEarning as any).dataValues as ApprovedEarning;
            // approvedEarning.earningStatus = ApprovedEarningStatus.Pause;

            let earningLiquidations = await this._earningLiquidationRepository.getByApprovedEarningID(approvedEarning.id);
            if (earningLiquidations && (Object.keys(earningLiquidations).length > 0 && earningLiquidations.some( earningLiquidation=>{
                const liquidation= (earningLiquidation as any).dataValues.liquidationStatus;
                return liquidation != LiquidationStatus.Declined && liquidation != LiquidationStatus.Processed
            }))) {
                res.statusCode = 400;
                res.payload = { message: "Liquidation request currently processing" };
                next()
                return;
            }

           let earningLiquidation = new EarningLiquidation();
            earningLiquidation.customerID = customer.id;
            earningLiquidation.code = this._utils.autogenerate({ prefix: "ETU" })
            earningLiquidation.status = BaseStatus.Active;
            earningLiquidation.liquidationStatus = LiquidationStatus.Pending;
            earningLiquidation.duration =  moment().diff(payoutDate, "month");//moment().diff(earningRequestLog.dateActive, "month");
            earningLiquidation.payoutDate = payoutDate;
            earningLiquidation.amount =amount; //(earningRequest.payout / earningRequest.duration) * earningLiquidation.duration;
            earningLiquidation.approvedEarningID = approvedEarning.id;

            // if (earningLiquidation.amount == 0) {
            //     res.statusCode = 400;
            //     res.data = { data: "No Earning accrued to liquidate yet" };
            //     next();
            //     return
            // }


            await this._earningLiquidationRepository.create(earningLiquidation);

            await this._earningRequestService.update(earningRequest);
            await this._earningRequestLogService.update(earningRequestLog);
            // await this._approvedEarningRepository.update(approvedEarning);
            await this._emailService.SendEmail({ type: EmailType.Earning, to: customer?.email, html: this._templateService.EARNING_LIQUIDATION_NOTIFICATION(customer?.firstName, earningRequest.requestId), toCustomer: true })

            await this._emailService.SendEmail({ type: EmailType.Earning, to: this._appConfig.INVESTMENT_EMAIL, html: `Customer ${customer.firstName} ${customer.lastName},<br/><br/> Requested for a liquidation on an earning with ID, ${earningRequest.requestId}`, toCustomer: false });
            res.statusCode = 200;
            res.payload = { message: "Our team has been notified successfully" }

        } catch (ex) {
            res.statusCode = 400;
            res.payload = { message: "Sorry we could not notify our team, Kindly retry" };
        }
        next()
    }
    @route('/getAllEarningDetails')
    @GET()
    getAllEarningDetails = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        // const id = this.sanitizer.escape(req.query.id);
        let response: any = await this._earningService.getAllEarningDetails(req.session.userData?.customer?.id, "earningRequest");
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data }
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }

        next()
    }
    @route('/getAllEarningLogDetails')
    @GET()
    getAllEarningLogDetails = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        const id = this.sanitizer.escape(req.query.id);
        let response: any = await this._earningService.getAllEarningDetails(req.session.userData?.customer?.id, "earningRequestLog");
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data }
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }

        next()
    }
    @route('/getApprovedEarning')
    @GET()
    getApprovedEarnings = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        const id = this.sanitizer.escape(req.query.requestId);
        let response: any = await this._approvedEarningService.getByEarningRequestId(id);
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data }
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }

        next()
    }
    @route('/updateStatus')
    @POST()
    updateStatus = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        let { status, id, failureReason, message, startDate, serialNumber } = req.body
        let response: any = await this._earningService.updateStatus({ requestStatus: status, id, failureReason, message, startDate, serialNumber });
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data }
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }

        next()
    }

    @route('/getLatestEarnings')
    @GET()
    getLatestEarning = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        console.log("Getting Latest Earning")
        let response: any = await this._earningRequestService.getLatestEarnings(req.session.userData);
        console.log("Gotten Latest Earning")
        if (response.status == true) {
            res.statusCode = 200;
            res.payload = { data: response.data };
        } else {
            res.statusCode = 400;
            res.payload = { message: response.message };
        }


        next()
    }

}