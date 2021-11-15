import AppConfig from "@api/config";
import { InvestmentRequest } from "@models/investment/investment-request";
import { InvestmentRequestLog } from "@models/investment/investment-request-log";
import { IInvestmentService } from "@services/interfaces/investment/Iinvestmentservice";
import EmailService, { EmailType } from "../common/email-service";
import { TemplateService } from "../common/template-service";
import UtilService from "../common/util";
export class InvestmentService implements IInvestmentService {
  constructor(private _appConfig: AppConfig, private _templateService: TemplateService, private _emailService: EmailService, private _utils: UtilService) {

  }
  getAllInvestmentRequests: () => Promise<InvestmentRequest[]>;
  getAllInvestmentRequestLogs: () => Promise<InvestmentRequestLog[]>;
  getInvestmentRequestById: () => Promise<InvestmentRequest>;
  getInvestmentRequestLogById: () => Promise<InvestmentRequestLog>;
  updateInvestmentRequest: (investmentRequest: InvestmentRequest) => Promise<InvestmentRequest>;


  restructure: (disbursedInvestmentId: number, repayment: number) => Promise<boolean>;

  process = ({ name, emailAddress, payout, duration, rate, maturity, amount, type }: any) => new Promise<any>(async (resolve, reject) => {
    try {
      const customerTemplate = this._templateService.INVESTMENT_CUSTOMER_TEMPLATE((!name) ? "Customer" : `${this._utils.titleCase(name)}`);
      const adminTemplate = this._templateService.INVESTMENT_ADMIN_TEMPLATE(name, emailAddress, this._utils.currencyFormatter(this._utils.convertToPlainNumber(amount)), duration, maturity, this._utils.currencyFormatter(payout), rate, type);
      await this._emailService.SendEmail({ type: EmailType.Investment, to: emailAddress, filePaths: [`dist/vanaheim/assets/static/VANIR CAPITAL GLOBAL PITCH DECK_Vol 4.pdf`], html: customerTemplate, toCustomer: true })

      await this._emailService.SendEmail({ type: EmailType.Investment, to: this._appConfig.INVESTMENT_EMAIL, html: adminTemplate, toCustomer: false });

      resolve({ status: true, data: { message: "Thanks for indicating your interest in investing 😊" } });

    }
    catch (err) {
      console.log(err);
      reject({ status: false, data: "Sorry we can not process your request at the moment. Kindly contact our support team." });
    }
  })



}