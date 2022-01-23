import AppConfig from "server/config"
import { Customer } from "@entities/customer"
import { ApprovedEarningStatus } from "@enums/approvedEarningStatus"
import { ApprovedEarning } from "@entities/investment/approved-investment"
import { EarningPayout } from "@entities/investment/investment-payout"
import { CustomerRepository } from "@repository/implementation/customer-repository"
import { IApprovedEarningRepository } from "@repository/interface/investment/Iapproved-earning-repository"
import { IEarningPayoutRepository } from "@repository/interface/investment/Iearning-payout-repository"
import moment = require("moment")
import { BaseService } from "../base-service"
import EmailService, { EmailType } from "../common/email-service"
import { TemplateService } from "../common/template-service"
import UtilService from "../common/util"
import { IEarningPayoutService } from "../../interfaces/investment/Iearning-payout-service"
import { EarningRequest } from "@entities/investment/investment-request"
import { IEarningRequestLogRepository } from "@repository/interface/investment/Iinvestment-request-log-repository"
import { IEarningRequestRepository } from "@repository/interface/investment/Iinvestment-request-repository"
import { EarningRequestStatus } from "@enums/investmentrequeststatus"
import { PaymentType } from "@enums/paymenttype"
import { BaseStatus } from "@enums/status"

type DateRange = {
  from: moment.Moment,
  to: moment.Moment
}
type Response<T> = {
  status: boolean,
  data: T
}
type EarningPayoutHealth = {

  dueDate: string,
  rawDate: Date,
  expectedPayment: number,
  amountRepaid: number,
  status: string,
  lastPayment: number,
  lastPaymentDate: Date
}
type EarningPayoutCycle = {
  paymentDate: string,
  rawDate: Date,
  earningBalance: number,
  principalEarningPayout: number,
  interestEarningPayout: number,
  earningEarningPayout: number
}
// enum EarningType {
//   FloatMe = 'float me',
//   Personal = "personal earning",
//   Business = "business earning"
// }
// call is made for payout cycle using disb id
// get earning details using disb id 
// get current payouts
// determine ideal cycle 
//-> Last payment cycle period (deduct now from date funded and get months/days)
//-> Last payment cycle range (datefunded + (last period-1)) to (datefunded + last period)
//-> Get EarningPayouts Made up until the end of last cycle and deduct from earning amount
//-> Get last cycle period and deduct from tenure
//-> Get ideal payout cycle
// determine payout health
// if first cycle then get default cycle
// get last payment cycle
// Determine if payouts made are full or partial or not paid at all
// Recalculate based on this info. -> If full update status and use default cycle -> else recalculate cycle

export class EarningPayoutService extends BaseService<EarningPayout> implements IEarningPayoutService {
  constructor(private _db: any, private _customerRepository: CustomerRepository, private _templateService: TemplateService, private _earningRequestLogRepository: IEarningRequestLogRepository, private _earningRequestRepository: IEarningRequestRepository, private _approvedEarningRepository: IApprovedEarningRepository, private _earningPayoutRepository: IEarningPayoutRepository, private _emailService: EmailService, private _appConfig: AppConfig, private _utils: UtilService) {
    super(_earningPayoutRepository)
  }
  getByApprovedEarningID = (approvedEarningId: number) => new Promise<any[]>(async (resolve, reject) => {

    try {
      let payouts = await this._earningPayoutRepository.getByApprovedEarningID(approvedEarningId) as EarningPayout[];
      resolve(payouts);
    } catch (err: any) {

    }
  });
  getTotalEarningPayout = (approvedEarningId: number) => new Promise<number>(async (resolve, reject) => {

    try {
      let payouts = await this._earningPayoutRepository.getByApprovedEarningID(approvedEarningId) as EarningPayout[];
      resolve(this.reducePayments(payouts, moment().add(2, 'year')))
    } catch (err: any) {

    }
  });
  processEarningPayout = ({ amount, approvedEarningId, earningRequestId, nextPayment, nextPaymentDate, dateOffset = 0 }: any) => new Promise<Response<string>>(async (resolve, reject) => {

    console.log("Amount to repay", amount, dateOffset)
    try {
      if (amount == 0) {
        resolve({ status: false, data: "Invalid request" });
        return;
      }
      if (!approvedEarningId) {
        resolve({ status: false, data: "Invalid request" });
        return;
      }
      let d = await this._approvedEarningRepository.getByIdWithInclude(approvedEarningId, [{
        model: this._db.EarningRequestLog,
        required: true
      }]);// as ApprovedEarning;
      let approvedEarning = new ApprovedEarning();
      Object.assign(approvedEarning, d?.dataValues);
      if (!approvedEarning) {
        resolve({ status: false, data: "Invalid request" });
        return;
      }
      if (approvedEarning.isClosed) {
        resolve({ status: true, data: "Earning has been paid off in full" });
        return;
      }
      let earningRequest = await this._earningRequestRepository.getByIdWithInclude(earningRequestId,[{model:this._db.Customer, required:true},{model:this._db.Account, required:true}]) as EarningRequest;
     
      if(!earningRequest || Object.keys(earningRequest).length==0){

      }
     let customer =(earningRequest.Customer as any).dataValues as Customer;
      let payoutsSoFar = await this._earningPayoutRepository.getByApprovedEarningID(approvedEarningId);
      let currentCycleEarningPayouts = this.reducePayments(payoutsSoFar, moment(nextPaymentDate ?? approvedEarning.nextPaymentDate), moment(nextPaymentDate ?? approvedEarning.nextPaymentDate).subtract(1,'month'));
      console.log("Current Cycle EarningPayouts", currentCycleEarningPayouts)
      let totalEarningPayoutSoFar = this.reducePayments(payoutsSoFar, moment(approvedEarning.maturityDate));//this.reducePayments(await this._earningPayoutRepository.getByApprovedEarningID(approvedEarningId),period.from.add(dateOffset,this.getDenom(earningRequest.denominator)));

      console.log("EarningPayouts so far", totalEarningPayoutSoFar)
      let expectedFullPayment = earningRequest.payout;
      let isPaidInFull = (totalEarningPayoutSoFar + amount) > expectedFullPayment
      console.log("Expected Full Payment", expectedFullPayment);

      if (isPaidInFull) amount = amount - ((totalEarningPayoutSoFar + amount) - expectedFullPayment);
      console.log("True Amount to repay", amount)
      let totalEarningPayout = (currentCycleEarningPayouts + amount);
      console.log("TotalEarningPayout", totalEarningPayout);
      let payout = new EarningPayout();
      if (totalEarningPayoutSoFar != expectedFullPayment) {
        payout.code = this._utils.autogenerate({ prefix: "RPY" });
        payout.amount = (currentCycleEarningPayouts + amount) > approvedEarning.nextPayment ? approvedEarning.nextPayment - currentCycleEarningPayouts : amount;
        payout.datePaid = dateOffset > 0 ? moment().add(dateOffset, "month").toDate() : new Date();
        payout.approvedEarningID = approvedEarningId;
        payout.earningRequestId = earningRequestId;
        payout.status = BaseStatus.Active;
        payout.accountNumber = "";
        payout.type = earningRequest.type;
        payout.payoutType = (amount < approvedEarning.nextPayment)&& !isPaidInFull ? PaymentType.Partial : PaymentType.FullPayment;
        payout.startingPrincipal=totalEarningPayoutSoFar;
        approvedEarning.earningStatus = ApprovedEarningStatus.OnTrack;
        await this._approvedEarningRepository.update(approvedEarning);
        let payoutInDb = await this._earningPayoutRepository.create(payout);
      }


      // if (totalEarningPayout > approvedEarning.nextPayment) {
      //   let rollOver = totalEarningPayout - approvedEarning.nextPayment;
      //   console.log("Amount rolling over ", rollOver);
      //   let payoutCycle = await this.getEarningPayoutHealth(approvedEarningId);
      //   let nextPayment = payoutCycle.data.filter(c => c.rawDate > approvedEarning.nextPaymentDate).sort(this.sortInDesc("rawDate"))[0];
      //   if (!nextPayment) { resolve({ status: true, data: "EarningPayout was successful but it was overdrafted by " + rollOver }); return; }
      //   console.log("Next Payment ", nextPayment);
      //   approvedEarning.nextPayment = nextPayment.expectedPayment;
      //   approvedEarning.nextPaymentDate = nextPayment.rawDate;
      //   let d = new ApprovedEarning();
      //   Object.assign(d, approvedEarning);
      //   console.log("Approved Earning ", d.nextPaymentDate);
      //   let approvedEarningInDb = await this._approvedEarningRepository.update(d);
      //   console.log(approvedEarningInDb)
      //   if (rollOver > 0) {
      //     let result = await this.processEarningPayout({
      //       nextPayment: approvedEarning.nextPayment,
      //       nextPaymentDate: approvedEarning.nextPaymentDate, amount: rollOver, approvedEarningId, earningRequestId, dateOffset: dateOffset += 1
      //     });
      //     resolve(result);
      //     return;
      //   }
      // }
      if ((totalEarningPayoutSoFar + amount) >= expectedFullPayment) {
        approvedEarning.isClosed = true;
        approvedEarning.earningStatus = ApprovedEarningStatus.PaidInFull;
        earningRequest.requestStatus = EarningRequestStatus.Matured;
        let res = await this._earningRequestLogRepository.search({ requestDate: earningRequest.requestDate, earningRequest: earningRequest?.id }, 0, 1);
        let earningRequestLog = res.rows[0];
        if (earningRequestLog) {
          earningRequestLog.requestStatus = EarningRequestStatus.Matured;
          this._earningRequestLogRepository.update(earningRequestLog);
        }
        await this._approvedEarningRepository.update(approvedEarning);
        await this._emailService.SendEmail({ type: EmailType.Earning, to: customer.email, html: `Dear ${customer.firstName} </br></br> A payment of ${this._utils.currencyFormatter(payout.amount)} has been made to your ${earningRequest.Account?.bank} account ${earningRequest.Account?.number}`, toCustomer: true })

        resolve({ status: true, data: "Earnings has been paid off in full" });
        return;
      }

      await this._emailService.SendEmail({ type: EmailType.Earning, to: customer.email, html: `Dear ${customer.firstName} </br></br> A payment of ${this._utils.currencyFormatter(payout.amount)} has been made to your ${earningRequest.Account?.bank} account ${earningRequest.Account?.number}`, toCustomer: true })

      // await this._emailService.SendEmail({ type: EmailType.Earning, to: this._appConfig.INVESTMENT_EMAIL, html: adminTemplate, toCustomer: false });

      resolve({ status: true, data: "Earning Payout was successful" });
      return;
    } catch (err: any) {
      resolve({ status: false, data: "Earning Payout was not successful" });
      return;
    }
  });
  processEarningPayoutPlan = ({ email, tenure, earningType, purpose, rate, earningAmount, monthlyEarningPayout }: any, userData: any) => new Promise<any>(async (resolve, reject) => {

    try {
      let customer;
      if (userData) {
        customer = await this._customerRepository.getByUserID(userData.id);
        if (customer && Object.keys(customer).length > 0) {
          customer = Object.assign(customer.dataValues as Customer, new Customer());
        }
      }
      const fileName = `EarningPayout Plan - ${Date.now()}`;
      let t = this.getEarningPayoutTemplate({ tenure: tenure + ' Month', earningType, purpose, rate, earningAmount, monthlyEarningPayout });
      let { path }: any = await this._templateService.generatePDF("EarningPayout Plan", [], "payouts/" + fileName, t);

      let sent = await this._emailService.SendEmail({ type: EmailType.EarningPayout, to: this._appConfig.ADMIN_EMAIL, attachment: path, html: t, toCustomer: false })
      await this._emailService.SendEmail({ type: EmailType.EarningPayout, to: email, attachment: path, html: this._templateService.REPAYMENT_PLAN_TEMPLATE(customer ? (customer?.firstName + ' ' + customer?.lastName) : "Customer"), toCustomer: true })
      resolve({ status: true, data: { message: "Sent successfully" } })

    } catch (err: any) {
      console.log(err)
      resolve({ status: false, message: "Failed" })
    }

  });


  getPastCycles(payouts: EarningPayout[], dateFunded: Date, lastCyclePeriod: number, denominator: string) {
    if (payouts.length == 0) return [];
    let d: any = this.getDenom(denominator);
    let earningBalance = this.getPaymentsTillLastCycleEnd(payouts, dateFunded, denominator);
    let pastCycles = [];
    for (let i = 0; i < (lastCyclePeriod - 1); i++) {

      let from = moment(dateFunded).add(i, d);
      let to = moment(dateFunded).add(i + 1, d);
      const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let dueDate = to.toDate().toLocaleDateString("en-US", options);

      let monthlyPayment = this.reducePayments(payouts, to, from);
      let monthlyInterest = earningBalance * i;
      let monthlyPrincipal = monthlyPayment - monthlyInterest;
      pastCycles.push({ paymentDate: dueDate, rawDate: to.toDate(), earningBalance, principalEarningPayout: monthlyPrincipal, interestEarningPayout: monthlyInterest, earningEarningPayout: monthlyPayment })
      earningBalance = earningBalance - monthlyPrincipal;
    }

    return pastCycles;
  }
  generateHealth = (payoutCycles: any[], currentEarningPayouts: EarningPayout[]): EarningPayoutHealth[] => {
    return [];
    // return payoutCycles.map((r, i) => {
    //   let amountRepaid = this.reducePayments(currentEarningPayouts, moment(r.rawDate), moment(r.rawDate).subtract(1, "month"));
    //   let lastEarningPayout = this.getLastEarningPayoutPerCycle(currentEarningPayouts, moment(r.rawDate).subtract(1, "month").toDate(), r.rawDate);

    //   console.log("Cycle " + i, amountRepaid, lastEarningPayout);
    //   let status = moment().toDate() > r.rawDate ? amountRepaid < r.earningEarningPayout ? "Defaulted" : "Fully Repaid" : (amountRepaid < r.earningEarningPayout) && this.isWithinCurrentCycle(moment(r.rawDate).subtract(1, "month").toDate(), r.rawDate) ? amountRepaid == 0 ? "Awaiting First Payment" : "Partial" : amountRepaid >= r.earningEarningPayout ? "Fully Paid" : "Not Yet Due"
    //   return { dueDate: r.paymentDate, rawDate: r.rawDate, expectedPayment: r.earningEarningPayout, amountRepaid, status, lastPayment: lastEarningPayout?.amount ?? 0, lastPaymentDate: lastEarningPayout?.dateRepaid };
    // })

  }

  isWithinCurrentCycle(from: Date, to: Date) {
    return moment().isBetween(from, to);
  }

  getLastEarningPayoutPerCycle(payouts: EarningPayout[], from: Date, to: Date) {
    return payouts.filter(r => {
      return r.datePaid >= from && r.datePaid < to;
    }).sort(this.sortInDesc("datePaid"))[0]
  }

  sortInDesc = (selector: string) => {
    return (a: any, b: any) => {
      if (a[selector] > b[selector]) {
        return -1;
      }
      if (a[selector] < b[selector]) {
        return 1;
      }
      return 0;
    }
  }
  getEarningPayoutHealth = (approvedEarningId: number) => new Promise<Response<EarningPayoutHealth[]>>(async (resolve, reject) => {
    try {
      let approvedEarning = await this._approvedEarningRepository.getByIdWithInclude(approvedEarningId, [{
        model: this._db.EarningRequest,
        required: true
      },
      {
        model: this._db.EarningRequestLog,
        required: true
      }
      ]) as ApprovedEarning;
      if (!approvedEarning) { console.log("getEarningPayoutHealth => Cant find Disbursed Earning"); resolve({ status: true, data: [] }) }

      let currentEarningPayouts = await this._earningPayoutRepository.getByApprovedEarningID(approvedEarningId);
      // let { tenure, earningType, rate, denominator, amount, dateApproved, monthlyPayment } = approvedEarning.EarningRequest;
      // let lastPeriod = this.lastPaymentCyclePeriod(dateApproved, denominator);
      // let t = tenure - lastPeriod;
      // const earningAmount = amount - this.getPaymentsTillLastCycleEnd(currentEarningPayouts, dateApproved, denominator);
      // let pastCycles = this.getPastCycles(currentEarningPayouts, dateApproved, lastPeriod, denominator);
      // let remainingCycles = this.generateEarningPayoutCycle({ dateFunded: moment(dateApproved).add(lastPeriod, this.getDenom(denominator)), tenure: t, denominator, rate: rate / 100, earningAmount, monthlyEarningPayout: this.calculateMonthlyEarningPayout(earningAmount, t, earningType) });
      let idealCycles:any[] = [];//[...pastCycles, ...remainingCycles];
      resolve({ status: true, data: this.generateHealth(idealCycles, currentEarningPayouts) });
    } catch (err: any) {
      console.log(err)
      resolve({ status: true, data: [] });
    }
  });
  getTenureRange = (type: string) => {
    if (type.toLowerCase().includes("float")) {
      return { min: 1, max: 30 };
    }
    return { min: 1, max: 12 };
  }

  // getRate = (type: EarningType, earningAmount: number, min: number, max: number) => {
  //   let interestRate = 0;
  //   if (type.toLowerCase().includes(EarningType.FloatMe)) {
  //     if (earningAmount >= min && earningAmount < 100000) {
  //       interestRate = 0.005;
  //     }
  //     else if (earningAmount >= 100000 && earningAmount < 200000) {
  //       interestRate = 0.0045;
  //     }
  //     else if (earningAmount >= 200000 && earningAmount < 1000000) {
  //       interestRate = 0.004;
  //     }
  //     else if (earningAmount >= 1000000 && earningAmount <= max) {
  //       interestRate = 0.0033;
  //     } else {
  //       // alert("Earning Amount must be between the range specified");
  //       interestRate = 0;
  //     }
  //     return interestRate;
  //   }
  //   else {
  //     if (earningAmount >= min && earningAmount < 100000) {
  //       interestRate = 0.1;
  //     }
  //     else if (earningAmount >= 100000 && earningAmount < 200000) {
  //       interestRate = 0.07;
  //     } else if (earningAmount >= 200000 && earningAmount < 1000000) {
  //       interestRate = 0.065;
  //     }
  //     else if (earningAmount >= 1000000 && earningAmount <= max) {
  //       interestRate = 0.06;
  //     } else {
  //       interestRate = 0;
  //     }
  //     return interestRate;
  //   }
  // }

  getDenominator = (tenure: number, earningType: string) => {
    if (earningType.toLowerCase().includes("float")) {
      return tenure > 1 ? "Days" : "Day";
    }
    return tenure > 1 ? "Mos" : "Mo";
  }
  // calculateMonthlyEarningPayout = (earningAmount: any, tenure: any, earningType: any) => {
  //   // earningAmount = this._utility.convertToPlainNumber(earningAmount)
  //   let minMax: any = this.getMinMax(earningType);
  //   let max = +minMax["max"];
  //   let min = +minMax["min"];
  //   let interestRate: number = 0;
  //   switch (earningType.toLowerCase()) {
  //     case "Float Me - Business":
  //       interestRate = this.getRate(EarningType.FloatMe, earningAmount, min, max);
  //       break;
  //     default: interestRate = this.getRate(earningType, earningAmount, min, max); break;
  //     // $monthlyHeader.textContent = "Monthly Payment (NGN)";

  //   }
  //   const P = earningAmount;
  //   const i = interestRate;
  //   const n = tenure;
  //   const monthlyPay = (P * i * ((1 + i) ** n)) / (((1 + i) ** n) - 1);
  //   return monthlyPay;
  //   // this._utility.currencyFormatter(monthlyPay);
  // }
  getMinMax = (earningType: any) => {
    switch (earningType.toLowerCase()) {
      case "business earnings":
        return { min: 50000, max: 10000000, minString: "50K", maxString: "10M", tenure: "monthly" };
      case "personal earnings":
        return { min: 25000, max: 5000000, minString: "25K", maxString: "5M", tenure: "monthly" };
      case "lpo financing":
        return { min: 50000, max: 10000000, minString: "50K", maxString: "10M", tenure: "monthly" };
      case "float me - business":
        return { min: 100000, max: 5000000, minString: "100K", maxString: "5M", tenure: "daily" };
      case "float me - personal":
        return { min: 25000, max: 1000000, minString: "25K", maxString: "1M", tenure: "daily" };
      default:
        return { min: 25000, max: 5000000, minString: "25K", maxString: "5M", tenure: "monthly" };
    }
  }
  getCurrentCyclePeriod(dateFunded: Date, denominator: string): number {
    let lastPeriod = this.lastPaymentCyclePeriod(dateFunded, denominator);
    return lastPeriod += 1;
  }
  getCurrentCycleRange(dateFunded: Date, denominator: string): DateRange {
    let lastPeriod = this.lastPaymentCyclePeriod(dateFunded, denominator);
    const d = this.getDenom(denominator);
    return { from: moment(dateFunded).add(lastPeriod, d), to: moment(dateFunded).add(lastPeriod + 1, d) }
  }
  private getDenom(denominator: string) {
    return denominator == "Months" ? "months" : "days";
  }
  lastPaymentCyclePeriod(dateFunded: Date, denominator: string): number {
    let funded = moment(dateFunded);
    let now = moment();
    const d = this.getDenom(denominator);
    return now.diff(funded, d);
  }
  lastPaymentCycleRange(dateFunded: Date, denominator: string): DateRange {
    let period = this.lastPaymentCyclePeriod(dateFunded, denominator);
    const d = this.getDenom(denominator);
    return { from: moment(dateFunded).add(period - 1, d), to: moment(dateFunded).add(period, d) }
  }
  getPaymentsTillLastCycleEnd(payouts: EarningPayout[], dateFunded: Date, denominator: string): number {
    let lastPaymentCycleDate = this.lastPaymentCycleRange(dateFunded, denominator).to;
    return this.reducePayments(payouts, lastPaymentCycleDate)
  }

  private reducePayments(payouts: EarningPayout[], to: moment.Moment, from?: moment.Moment): number {
    // return 0;
    
   return payouts.reduce((total, payout) => {
      if (!from && payout.datePaid < to.toDate()) return total +=(+ payout.amount);
      if (from && payout.datePaid > from.toDate() && payout.datePaid < to.toDate()) return total +=(+ payout.amount);
      return total += 0;
    }, 0)
  }
  generateEarningPayoutCycle({ tenure, denominator, rate, earningAmount, monthlyEarningPayout, dateFunded }: any): EarningPayoutCycle[] {

    // let p = Number(earningAmount.replace(/[^0-9.-]+/g, ""));
    let p = earningAmount;
    let earningEarningPayout = monthlyEarningPayout.toString();
    let i = rate;
    let period = "month";
    if (denominator.toLowerCase().includes("day")) {
      period = "day";
    }
    let today = dateFunded ? moment(dateFunded) : moment();
    // earningEarningPayout = Number(earningEarningPayout.replace(/[^0-9.-]+/g, ""));
    let earningBalance = p;
    let monthlyPrincipal = 0;
    let monthlyInterest = 0;
    let payouts = [];
    for (var c = 0; c < tenure; c++) {
      if (period === "month") { today.add(1, "month") } else {
        today.add(1, "day");
      }
      monthlyInterest = earningBalance * i;
      monthlyPrincipal = earningEarningPayout - monthlyInterest;
      const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let dueDate = today.toDate().toLocaleDateString("en-US", options);

      let outstanding = earningBalance - monthlyPrincipal;
      if (outstanding < 0) outstanding = 0;
      if (earningBalance < 0) earningBalance = 0;
      payouts.push({ paymentDate: dueDate, rawDate: today.toDate(), earningBalance, principalEarningPayout: monthlyPrincipal, interestEarningPayout: monthlyInterest, earningEarningPayout })
      earningBalance = earningBalance - monthlyPrincipal;
    }

    return payouts;
  }
  private getEarningPayoutTemplate({ tenure, earningType, purpose, rate, earningAmount, monthlyEarningPayout }: any): string {
    let template = "";
    //<img src="cid:unique@kreata.ee" style="object-fit:cover;width:100% !important; margin-bottom:50px"/> 
    //<img src="${mailHeader}" style="object-fit:cover;width:80%; margin:auto; margin-left:10%;margin-bottom:50px"/>
    template += `<div style="width:100% !important;  text-align:center;"><div style="background: #E6AF2A; margin-bottom:20px; padding-top:20px ;padding-bottom:20px;"> <h2>Your EarningPayout Plan</h2></div></div>`
    let p = Number(earningAmount.replace(/[^0-9.-]+/g, ""));
    let n = tenure;
    let m = monthlyEarningPayout.toString();
    let i = rate;
    let tp = "Monthly";
    let period = "month";
    if (n.toLowerCase().includes("day")) {
      //   m =  dataSet["Daily EarningPayout"];
      period = "day";
      tp = "Daily"
    }
    console.log(n.toLowerCase());
    if (n) { n = parseInt(n.split(' ')[0].trim()); }
    template += `
        <div style="width:100%;">
        <div style="color:#333333;padding-top:10px; padding-bottom:10px; width:100%; justify-content:space-between;">
                      <p style="padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333; justify-content:space-between; color:#E6AF2A;">Purpose</p><p style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${this._utils.titleCase(purpose)}</p>
                    </div>
                    <div style="color:#333333;padding-top:10px; padding-bottom:10px; width:100%;  justify-content:space-between;">
                      <p style="padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333; color:#E6AF2A;">Type</p><p style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${this._utils.titleCase(earningType)}</p>
                    </div>  
                    </div>
                    <div style="width:100%;position:relative;">
                    <br/><br/>
                    <h3>Earning Information</h3>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100% !important; margin-bottom:60px;  border:1px solid #e0e0e0; font-size:12px !important;">
                    <tbody style="width:100%">
                    
                    <tr style="color:#333333;padding-top:10px; padding-bottom:10px;">
                      <td style="padding-left:10px;padding-top:10px; border-bottom:1px solid #e0e0e0; padding-bottom:10px;background: #333333; color:#E6AF2A;">Earning Amount <b>(NGN)</b></td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${earningAmount.replace("NGN", '').trim()}</td>
                    </tr> 
                    <tr style="color:#333333">
                      <td style="border-bottom:1px solid #e0e0e0;padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333;color:#E6AF2A;">Chosen Tenure</td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${this._utils.titleCase(tenure)}</td>
                    </tr>
                    
                    <tr>
                      <td style="padding-left:10px;padding-top:10px; padding-bottom:10px;color: #333333; font-weight:bold;">${this._utils.titleCase(tp)}  Installment <b>(NGN)</b></td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;color: #333333;background:#e0e0e0;"><b>${this._utils.currencyFormatter(this._utils.convertToPlainNumber(m)).replace("NGN", '').trim()}</b></td> 
                    </tr>
                    </tbody>
        </table>
        </div>
        <div style="width:100%; position:relative;">
        <h3>EarningPayout Schedule</h3>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100% !important; font-size:12px !important; border:1px solid #e0e0e0;">
                    <thead style="width:100%;">
                      <tr style="text-align:center; width:100%; color:#E6AF2A; background:#333333; padding-top:10px; padding-bottom:10px;">
                        <th style="padding-top:10px; padding-bottom:10px;">Payment Date</th>
                        <th style="padding-top:10px; padding-bottom:10px;">Earning Balance <b>(NGN)</b></th>
                        <th style="padding-top:10px; padding-bottom:10px;">Principal EarningPayout <b>(NGN)</b></th>
                        <th style="padding-top:10px; padding-bottom:10px;">Interest EarningPayout <b>(NGN)</b></th>
                        <th style="padding-top:10px; padding-bottom:10px;">Earning EarningPayout <b>(NGN)</b></th>
                      </tr>
                    </thead>
                    <tbody>
                   `;

    const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today = moment();
    m = Number(m.replace(/[^0-9.-]+/g, ""));
    let beginning = p;
    let monthlyPrincipal = 0;
    let monthlyInterest = 0;//m-(p/n);
    let payment = monthlyInterest + monthlyPrincipal;
    let total = m * n;
    console.log(p)
    console.log(total)
    for (var c = 0; c < n; c++) {
      if (period === "month") { today.add(1, "month") } else {
        today.add(1, "day");
      }
      monthlyInterest = beginning * i;
      monthlyPrincipal = m - monthlyInterest;
      // console.log(today.toLocaleDateString("en-US", options));
      let lDate = today.toDate().toLocaleDateString("en-US", options);

      let outstanding = beginning - monthlyPrincipal;
      if (outstanding < 0) outstanding = 0;
      if (beginning < 0) beginning = 0;
      template += `<tr style="padding-top:10px; padding-bottom:10px; width:100%;">
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${lDate}</td>
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utils.currencyFormatter(beginning).replace("NGN", '').trim()}</td>
                                  
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utils.currencyFormatter(monthlyPrincipal).replace("NGN", '').trim()}</td>
                                  
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utils.currencyFormatter(monthlyInterest).replace("NGN", '').trim()}</td>
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utils.currencyFormatter(m).replace("NGN", '').trim()}</td>
                                </tr>`
      beginning = beginning - monthlyPrincipal;
    }
    template += `<tr style="style="width:100%" background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;"><td style="padding-left:10px;background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;" colspan="4">Total EarningPayout (Principal + Interest)</td><td style="padding-left:10px;background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;">${this._utils.currencyFormatter(total).replace("NGN", '').trim()}</td></tr></tbody></table></div>`

    return template;
  }
}