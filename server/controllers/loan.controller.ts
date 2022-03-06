
import { VanaheimQueryRequest, VanaheimBodyRequest } from '@models/express/request';
import { VanaheimTypedResponse } from '@models/express/response';
import { IDisbursedLoanService } from '@services/interfaces/loan/Idisbursed-loan-service';
import { ILoanRequestLogService } from '@services/interfaces/loan/Iloan-log-request-service';
import { ILoanRequestService } from '@services/interfaces/loan/Iloan-request-service';
import { ILoanService } from '@services/interfaces/loan/Iloanservice';
import { GET, POST, route } from 'awilix-express';
@route('/api/loans')
export default class UserController {

    bvnList: any = {
    };
    bankList: any = {};
    constructor(private sanitizer: any, private _loanService: ILoanService, private _disbursedLoanService: IDisbursedLoanService, private _loanRequestService: ILoanRequestService, private _loanRequestLogService: ILoanRequestLogService) {

    }

    @route('/getAllLoanRequests')
    @GET()
    getAllLoanRequests = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            console.log("Loans Controller", req.session)
            let loanRequests = await this._loanService.getAllLoanRequests();
            res.statusCode = 200;
            res.payload = { data: loanRequests };
        } catch (err) {
            res.statusCode = 400;
            res.payload = { message: "Could not get loan" };
        }

        next()

    }

    @route('/create')
    @POST()
    new = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            let response: any = await this._loanService.processLoanRequest(req.body, req.session.userData);
            if (response.status == true) {
                res.statusCode = 200;
                res.payload = { data: response.data }
            } else {
                res.statusCode = 400;
                res.payload = { message: response.message??response.data };
            }
        } catch (err) {
            res.statusCode = 400;
            res.payload = { message: "Could not get create loan" };
        }

        next()
    }

    @route('/search')
    @POST()
    search = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        console.log("Searching Logs");
        try {
            let response: any = await this._loanRequestLogService.search(req.body, req.session.userData.customer);
            if (response.status == true) {
                res.statusCode = 200;
                res.payload = { data: response.data }
            } else {
                res.statusCode = 400;
                res.payload = { message: response.message??response.data };
            }
        } catch (err) {
            res.statusCode = 400;
            res.payload = { message: "Could not get loan" };
        }

        next()
    }
    @route('/searchToProcess')
    @POST()
    searchForAdmin = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {

        try {
            console.log("Searching Logs");
            let response: any = await this._loanRequestService.search(req.body);
            if (response.status == true) {
                res.statusCode = 200;
                res.payload = { data: response.data }
            } else {
                res.statusCode = 400;
                res.payload = { message: response.message??response.data };
            }
        } catch (err) {
            res.statusCode = 400;
            res.payload = { message: "Could not get loan" };
        }

        next()
    }
    @route('/getLoanDetails')
    @GET()
    getLoanDetails = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.id);
            let response: any = await this._loanService.getLoanDetails(id, "loanRequest");
            if (response.status == true) {
                res.statusCode = 200;
                res.payload = { data: response.data }
            } else {
                res.statusCode = 400;
                res.payload = { message: response.message??response.data };
            }
        } catch (err) {
            res.statusCode = 400;
            res.payload = { message: "Could not get loan details" };
        }

        next()
    }
    @route('/getLoanLogDetails')
    @GET()
    getLoanLogDetails = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.id);
            let response: any = await this._loanService.getLoanDetails(id, "loanRequestLog");
            if (response.status == true) {
                res.statusCode = 200;
                res.payload = { data: response.data }
            } else {
                res.statusCode = 400;
                res.payload = { message: response.message??response.data };
            }
        } catch (err) {
            res.statusCode = 400;
            res.payload = { message: "Could not get loan details" };
        }

        next()
    }
    @route('/getDisbursedLoan')
    @GET()
    getDisbursedLoans = async (req: VanaheimQueryRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            const id = this.sanitizer.escape(req.query.requestId);
            let response: any = await this._disbursedLoanService.getDisbursedLoanById(id);
            if (response.status == true) {
                res.statusCode = 200;
                res.payload = { data: response.data }
            } else {
                res.statusCode = 400;
                res.payload = { message: response.message??response.data };
            }
        } catch (err) {
            res.statusCode = 400;
            res.payload = { message: "Could not get disbursed loan" };
        }

        next()
    }
    @route('/updateStatus')
    @POST()
    updateStatus = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            let { status, id, failureReason, message, serialNumber } = req.body
            let response: any = await this._loanService.updateStatus({ requestStatus: status, id, failureReason, message, serialNumber });
            if (response.status == true) {
                res.statusCode = 200;
                res.payload = { data: response.data }
            } else {
                res.statusCode = 400;
                res.payload = { message: response.message??response.data };
            }
        } catch (err) {
            res.statusCode = 400;
            res.payload = { message: "Could not update status" };
        }

        next()
    }

    @route('/getLatestLoan')
    @GET()
    getLatestLoan = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        try {
            console.log("Getting Latest Loan")
            let response: any = await this._loanRequestService.getLatestLoan(req.session.userData);
            console.log("Gotten Latest Loan")
            if (response.status == true) {
                res.statusCode = 200;
                res.payload = { data: response.data };
            } else {
                res.statusCode = 400;
                res.payload = { message: response.message??response.data };
            }
        } 
        catch (err) {
            res.statusCode = 400;
            res.payload = { message: "Could not get latest loan" };
        }

        next()
    }
}