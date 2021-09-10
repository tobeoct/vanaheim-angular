import AppConfig from "@api/config";
import { Customer } from "@models/customer";
import { LoanRequestStatus } from "@models/helpers/enums/loanrequeststatus";
import { LoanStatus } from "@models/helpers/enums/loanstatus";
import { PaymentType } from "@models/helpers/enums/paymenttype";
import { BaseStatus } from "@models/helpers/enums/status";
import { DisbursedLoan } from "@models/loan/disbursed-loan";
import { LoanRequest } from "@models/loan/loan-request";
import { Repayment } from "@models/loan/repayment";
import { CustomerRepository } from "@repository/implementation/customer-repository";
import { IRepaymentRepository } from "@repository/interface/Irepayment-repository";
import { IDisbursedLoanRepository } from "@repository/interface/loan/Idisbursed-loan-repository";
import { ILoanRequestLogRepository } from "@repository/interface/loan/Iloan-request-log-repository";
import { ILoanRequestRepository } from "@repository/interface/loan/Iloan-request-repository";
import { IRepaymentService } from "@services/interfaces/Irepayment-service";
import moment = require("moment");
import { BaseService } from "./base-service";
import EmailService from "./common/email-service";
import { TemplateService } from "./common/template-service";
import UtilService from "./common/util";
type DateRange = {
  from: moment.Moment,
  to: moment.Moment
}
type Response<T> = {
  status: boolean,
  data: T
}
type RepaymentHealth = {

  dueDate: string,
  rawDate: Date,
  expectedPayment: number,
  amountRepaid: number,
  status: string,
  lastPayment: number,
  lastPaymentDate: Date
}

// call is made for repayment cycle using disb id
// get loan details using disb id 
// get current repayments
// determine ideal cycle 
//-> Last payment cycle period (deduct now from date funded and get months/days)
//-> Last payment cycle range (datefunded + (last period-1)) to (datefunded + last period)
//-> Get Repayments Made up until the end of last cycle and deduct from loan amount
//-> Get last cycle period and deduct from tenure
//-> Get ideal repayment cycle
// determine repayment health
// if first cycle then get default cycle
// get last payment cycle
// Determine if repayments made are full or partial or not paid at all
// Recalculate based on this info. -> If full update status and use default cycle -> else recalculate cycle

export class RepaymentService extends BaseService<Repayment> implements IRepaymentService {
  constructor(private _db: any, private _customerRepository:CustomerRepository, private _templateService: TemplateService, private _loanRequestLogRepository: ILoanRequestLogRepository, private _loanRequestRepository: ILoanRequestRepository, private _disbursedLoanRepository: IDisbursedLoanRepository, private _repaymentRepository: IRepaymentRepository, private _emailService: EmailService, private _appConfig: AppConfig, private _utilService: UtilService) {
    super(_repaymentRepository)
  }
  getByDisbursedLoanID = (disbursedLoanId: number) => new Promise<any[]>(async (resolve, reject) => {

    try {
      let repayments = await this._repaymentRepository.getByDisbursedLoanID(disbursedLoanId) as Repayment[];
      resolve(repayments);
    } catch (err:any) {

    }
  });
  getTotalRepayment = (disbursedLoanId: number) => new Promise<number>(async (resolve, reject) => {

    try {
      let repayments = await this._repaymentRepository.getByDisbursedLoanID(disbursedLoanId) as Repayment[];
      resolve(this.reducePayments(repayments, moment().add(2, 'year')))
    } catch (err:any) {

    }
  });
  processRepayment = ({ amount, disbursedLoanId, loanRequestId, nextPayment, nextRepaymentDate, dateOffset = 0 }: any) => new Promise<Response<string>>(async (resolve, reject) => {

    console.log("Amount to repay", amount, dateOffset)
    try {
      if (amount == 0) {
        resolve({ status: false, data: "Invalid request" });
        return;
      }
      if (!disbursedLoanId) {
        resolve({ status: false, data: "Invalid request" });
        return;
      }
      let d = await this._disbursedLoanRepository.getByIdWithInclude(disbursedLoanId, [{
        model: this._db.LoanRequestLog,
        required: true
      }]);// as DisbursedLoan;
      let disbursedLoan = new DisbursedLoan();
      Object.assign(disbursedLoan, d?.dataValues);
      console.log("Disbursed Loan", disbursedLoan)
      if (!disbursedLoan) {
        resolve({ status: false, data: "Invalid request" });
        return;
      }
      if (disbursedLoan.isClosed) {
        resolve({ status: true, data: "Loan has been paid off in full" });
        return;
      }
      let loanRequest = await this._loanRequestRepository.getById(loanRequestId) as LoanRequest;
      // let period = this.getCurrentCycleRange(disbursedLoan.dateDisbursed,loanRequest.denominator);
      let repaymentsSoFar = await this._repaymentRepository.getByDisbursedLoanID(disbursedLoanId);
      let currentCycleRepayments = this.reducePayments(repaymentsSoFar, moment(nextRepaymentDate ?? disbursedLoan.nextRepaymentDate), moment(nextRepaymentDate ?? disbursedLoan.nextRepaymentDate).subtract(1, this.getDenom(loanRequest.denominator)));
      console.log("Current Cycle Repayments", currentCycleRepayments)
      let totalRepaymentSoFar = this.reducePayments(repaymentsSoFar, moment(disbursedLoan.maturityDate));//this.reducePayments(await this._repaymentRepository.getByDisbursedLoanID(disbursedLoanId),period.from.add(dateOffset,this.getDenom(loanRequest.denominator)));
      // totalRepayment+=amount;
      console.log("Repayments so far", totalRepaymentSoFar)
      let expectedFullPayment = loanRequest.totalRepayment;
      let isPaidInFull = (totalRepaymentSoFar + amount) > expectedFullPayment
      console.log("Expected Full Payment", expectedFullPayment);

      if (isPaidInFull) amount = amount - ((totalRepaymentSoFar + amount) - expectedFullPayment);
      console.log("True Amount to repay", amount)
      let totalRepayment = (currentCycleRepayments + amount);
      console.log("TotalRepayment", totalRepayment);
      // if ((totalRepayment <= disbursedLoan.nextPayment)) {
      if (totalRepaymentSoFar != expectedFullPayment) {
        let repayment = new Repayment();
        repayment.code = this._utilService.autogenerate({ prefix: "RPY" });
        repayment.amount = (currentCycleRepayments + amount) > disbursedLoan.nextPayment ? disbursedLoan.nextPayment - currentCycleRepayments : amount;
        repayment.dateRepaid = dateOffset > 0 ? moment().add(dateOffset, this.getDenom(loanRequest.denominator)).toDate() : new Date();
        repayment.disbursedLoanID = disbursedLoanId;
        repayment.loanRequestID = loanRequestId;
        repayment.status = BaseStatus.Active;
        repayment.accountNumber = "";
        repayment.repaymentType = amount < disbursedLoan.nextPayment ? PaymentType.Partial : PaymentType.FullPayment;
        disbursedLoan.loanStatus = LoanStatus.OnTrack;
        await this._disbursedLoanRepository.update(disbursedLoan);
        let repaymentInDb = await this._repaymentRepository.create(repayment);
      }
      // }


      if (totalRepayment > disbursedLoan.nextPayment) {
        let rollOver = totalRepayment - disbursedLoan.nextPayment;
        console.log("Amount rolling over ", rollOver);
        let repaymentCycle = await this.getRepaymentHealth(disbursedLoanId);
        let nextPayment = repaymentCycle.data.filter(c => c.rawDate > disbursedLoan.nextRepaymentDate).sort(this.sortInDesc("rawDate"))[0];
        if (!nextPayment) { resolve({ status: true, data: "Repayment was successful but it was overdrafted by " + rollOver }); return; }
        console.log("Next Payment ", nextPayment);
        disbursedLoan.nextPayment = nextPayment.expectedPayment;
        disbursedLoan.nextRepaymentDate = nextPayment.rawDate;
        let d = new DisbursedLoan();
        Object.assign(d, disbursedLoan);
        console.log("Disbursed Loan ", d.nextRepaymentDate);
        let disbursedLoanInDb = await this._disbursedLoanRepository.update(d);
        console.log(disbursedLoanInDb)
        if (rollOver > 0) {
          let result = await this.processRepayment({
            nextPayment: disbursedLoan.nextPayment,
            nextRepaymentDate: disbursedLoan.nextRepaymentDate, amount: rollOver, disbursedLoanId, loanRequestId, dateOffset: dateOffset += 1
          });
          resolve(result);
          return;
        }
      }
      if ((totalRepaymentSoFar + amount) >= expectedFullPayment) {
        disbursedLoan.isClosed = true;
        disbursedLoan.loanStatus = LoanStatus.PaidInFull;
        loanRequest.requestStatus = LoanRequestStatus.Completed;
        let res = await this._loanRequestLogRepository.search({ requestDate: loanRequest.requestDate, loanRequest: loanRequest?.id }, 0, 1);
        let loanRequestLog = res.rows[0];
        if (loanRequestLog) {
          loanRequestLog.requestStatus = LoanRequestStatus.Completed;
          this._loanRequestLogRepository.update(loanRequestLog);
        }
        await this._disbursedLoanRepository.update(disbursedLoan);
        resolve({ status: true, data: "Loan has been paid off in full" });
        return;
      }
      resolve({ status: true, data: "Repayment was successful" });
      return;
    } catch (err:any) {
      resolve({ status: false, data: "Repayment was not successful" });
      return;
    }
  });
  processRepaymentPlan = ({ email, tenure, denominator, loanType, purpose, rate, loanAmount, monthlyRepayment }: any,userData:any) => new Promise<any>(async (resolve, reject) => {

    try {
      let customer;
      if(userData){
       customer = await this._customerRepository.getByUserID(userData.id);
      if (customer && Object.keys(customer).length > 0) {
        customer= Object.assign(customer.dataValues as Customer, new Customer());
      }
    }
       const fileName = `Repayment Plan - ${Date.now()}`;
      let t = this.getRepaymentTemplate({ tenure: tenure + ' ' + denominator, loanType, purpose, rate, loanAmount, monthlyRepayment });
      let { path }: any = await this._templateService.generatePDF("Repayment Plan", [], "repayments/" + fileName, t);

      let sent = await this._emailService.SendEmail({ type: 'repayment', to: this._appConfig.ADMIN_EMAIL, attachment: path, filePaths: null, html: t, toCustomer: false })
      await this._emailService.SendEmail({ type: 'repayment', to: email, attachment: path, filePaths: null, html: this._templateService.REPAYMENT_PLAN_TEMPLATE(customer? (customer?.firstName+' '+customer?.lastName):"Customer"), toCustomer: true })
      resolve({ status: true, data: { message: "Sent successfully" } })

    } catch (err:any) {
      console.log(err)
      resolve({ status: false, message: "Failed" })
    }

  });
  restructureRepaymentPlan(repaymentCycle: any[], currentRepayments: Repayment[]) {
    let newHistory = [];
    repaymentCycle.forEach(plan => {

    })
  }

  getPastCycles(repayments: Repayment[], dateFunded: Date, lastCyclePeriod: number, denominator: string) {
    if (repayments.length == 0) return [];
    let d: any = this.getDenom(denominator);
    let loanBalance = this.getPaymentsTillLastCycleEnd(repayments, dateFunded, denominator);
    let pastCycles = [];
    for (let i = 0; i < (lastCyclePeriod - 1); i++) {

      let from = moment(dateFunded).add(i, d);
      let to = moment(dateFunded).add(i + 1, d);
      const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let dueDate = to.toDate().toLocaleDateString("en-US", options);

      let monthlyPayment = this.reducePayments(repayments, to, from);
      let monthlyInterest = loanBalance * i;
      let monthlyPrincipal = monthlyPayment - monthlyInterest;
      pastCycles.push({ paymentDate: dueDate, rawDate: to.toDate(), loanBalance, principalRepayment: monthlyPrincipal, interestRepayment: monthlyInterest, loanRepayment: monthlyPayment })
      loanBalance = loanBalance - monthlyPrincipal;
    }

    return pastCycles;
  }
  generateHealth = (repaymentCycles: any[], currentRepayments: Repayment[]): RepaymentHealth[] => {
    return repaymentCycles.map((r, i) => {
      let amountRepaid = this.reducePayments(currentRepayments, moment(r.rawDate), moment(r.rawDate).subtract(1, "month"));
      let lastRepayment = this.getLastRepaymentPerCycle(currentRepayments, moment(r.rawDate).subtract(1, "month").toDate(), r.rawDate);

      console.log("Cycle " + i, amountRepaid, lastRepayment);
      let status = moment().toDate() > r.rawDate ? amountRepaid < r.loanRepayment ? "Defaulted" : "Fully Repaid" : (amountRepaid < r.loanRepayment) && this.isWithinCurrentCycle(moment(r.rawDate).subtract(1, "month").toDate(), r.rawDate) ? amountRepaid == 0 ? "Awaiting First Payment" : "Partial" : amountRepaid >= r.loanRepayment ? "Fully Paid" : "Not Yet Due"
      return { dueDate: r.paymentDate, rawDate: r.rawDate, expectedPayment: r.loanRepayment, amountRepaid, status, lastPayment: lastRepayment?.amount ?? 0, lastPaymentDate: lastRepayment?.dateRepaid };
    })

  }

  isWithinCurrentCycle(from: Date, to: Date) {
    return moment().isBetween(from, to);
  }

  getLastRepaymentPerCycle(repayments: Repayment[], from: Date, to: Date) {
    return repayments.filter(r => {
      return r.dateRepaid >= from && r.dateRepaid < to;
    }).sort(this.sortInDesc("dateRepaid"))[0]
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
  getRepaymentHealth = (disbursedLoanId: number) => new Promise<Response<RepaymentHealth[]>>(async (resolve, reject) => {
    try {
      let disbursedLoan = await this._disbursedLoanRepository.getByIdWithInclude(disbursedLoanId, [{
        model: this._db.LoanRequest,
        required: true
      },
      {
        model: this._db.LoanRequestLog,
        required: true
      }
      ]) as DisbursedLoan;
      if (!disbursedLoan) { console.log("getRepaymentHealth => Cant find Disbursed Loan"); resolve({ status: true, data: [] }) }

      let currentRepayments = await this._repaymentRepository.getByDisbursedLoanID(disbursedLoanId);
      let { tenure, loanType, rate, denominator, amount, dateApproved, monthlyPayment } = disbursedLoan.LoanRequest;
      let lastPeriod = this.lastPaymentCyclePeriod(dateApproved, denominator);
      let t = tenure - lastPeriod;
      const loanAmount = amount - this.getPaymentsTillLastCycleEnd(currentRepayments, dateApproved, denominator);
      let pastCycles = this.getPastCycles(currentRepayments, dateApproved, lastPeriod, denominator);
      let remainingCycles = this.generateRepaymentCycle({ dateFunded: moment(dateApproved).add(lastPeriod, this.getDenom(denominator)), tenure: t, denominator, rate: rate / 100, loanAmount, monthlyRepayment: this.calculateMonthlyRepayment(loanAmount, t, loanType) });
      let idealCycles = [...pastCycles, ...remainingCycles];
      resolve({ status: true, data: this.generateHealth(idealCycles, currentRepayments) });
    } catch (err:any) {
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
  getRate = (type: string, loanAmount: number, min: number, max: number) => {
    let interestRate = 0;
    if (type.toLowerCase().includes('float me')) {
      if (loanAmount >= min && loanAmount < 100000) {
        interestRate = 0.005;
      }
      else if (loanAmount >= 100000 && loanAmount < 200000) {
        interestRate = 0.0045;
      }
      else if (loanAmount >= 200000 && loanAmount < 1000000) {
        interestRate = 0.004;
      }
      else if (loanAmount >= 1000000 && loanAmount <= max) {
        interestRate = 0.0033;
      } else {
        // alert("Loan Amount must be between the range specified");
        interestRate = 0;
      }
      return interestRate;
    }
    else {
      if (loanAmount >= min && loanAmount < 100000) {
        interestRate = 0.1;
      }
      else if (loanAmount >= 100000 && loanAmount < 200000) {
        interestRate = 0.07;
      } else if (loanAmount >= 200000 && loanAmount < 1000000) {
        interestRate = 0.065;
      }
      else if (loanAmount >= 1000000 && loanAmount <= max) {
        interestRate = 0.06;
      } else {
        interestRate = 0;
      }
      return interestRate;
    }
  }

  getDenominator = (tenure: number, loanType: string) => {
    if (loanType.toLowerCase().includes("float")) {
      return tenure > 1 ? "Days" : "Day";
    }
    return tenure > 1 ? "Mos" : "Mo";
  }
  calculateMonthlyRepayment = (loanAmount: any, tenure: any, loanType: any) => {
    // loanAmount = this._utility.convertToPlainNumber(loanAmount)
    let minMax: any = this.getMinMax(loanType);
    let max = +minMax["max"];
    let min = +minMax["min"];
    let interestRate: number = 0;
    switch (loanType.toLowerCase()) {
      case "Float Me - Business":
        interestRate = this.getRate("float me", loanAmount, min, max);
        break;
      default: interestRate = this.getRate(loanType, loanAmount, min, max); break;
      // $monthlyHeader.textContent = "Monthly Payment (NGN)";

    }
    const P = loanAmount;
    const i = interestRate;
    const n = tenure;
    const monthlyPay = (P * i * ((1 + i) ** n)) / (((1 + i) ** n) - 1);
    return monthlyPay;
    // this._utility.currencyFormatter(monthlyPay);
  }
  getMinMax = (loanType: any) => {
    switch (loanType.toLowerCase()) {
      case "business loans":
        return { min: 50000, max: 10000000, minString: "50K", maxString: "10M", tenure: "monthly" };
      case "personal loans":
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
  getPaymentsTillLastCycleEnd(repayments: Repayment[], dateFunded: Date, denominator: string): number {
    let lastPaymentCycleDate = this.lastPaymentCycleRange(dateFunded, denominator).to;
    return this.reducePayments(repayments, lastPaymentCycleDate)
  }

  private reducePayments(repayments: Repayment[], to: moment.Moment, from?: moment.Moment): number {
    return repayments.reduce((total, repayment) => {
      if (!from && repayment.dateRepaid < to.toDate()) return total += repayment.amount;
      if (from && repayment.dateRepaid > from.toDate() && repayment.dateRepaid < to.toDate()) return total += repayment.amount;
      return total += 0;
    }, 0)
  }
  generateRepaymentCycle({ tenure, denominator, rate, loanAmount, monthlyRepayment, dateFunded }: any) {

    // let p = Number(loanAmount.replace(/[^0-9.-]+/g, ""));
    let p = loanAmount;
    let loanRepayment = monthlyRepayment.toString();
    let i = rate;
    let period = "month";
    if (denominator.toLowerCase().includes("day")) {
      period = "day";
    }
    let today = dateFunded ? moment(dateFunded) : moment();
    // loanRepayment = Number(loanRepayment.replace(/[^0-9.-]+/g, ""));
    let loanBalance = p;
    let monthlyPrincipal = 0;
    let monthlyInterest = 0;
    let repayments = [];
    for (var c = 0; c < tenure; c++) {
      if (period === "month") { today.add(1, "month") } else {
        today.add(1, "day");
      }
      monthlyInterest = loanBalance * i;
      monthlyPrincipal = loanRepayment - monthlyInterest;
      const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let dueDate = today.toDate().toLocaleDateString("en-US", options);

      let outstanding = loanBalance - monthlyPrincipal;
      if (outstanding < 0) outstanding = 0;
      if (loanBalance < 0) loanBalance = 0;
      repayments.push({ paymentDate: dueDate, rawDate: today.toDate(), loanBalance, principalRepayment: monthlyPrincipal, interestRepayment: monthlyInterest, loanRepayment })
      loanBalance = loanBalance - monthlyPrincipal;
    }

    return repayments;
  }
  private getRepaymentTemplate({ tenure, loanType, purpose, rate, loanAmount, monthlyRepayment }: any): string {
    let template = "";
    //<img src="cid:unique@kreata.ee" style="object-fit:cover;width:100% !important; margin-bottom:50px"/> 
    //<img src="${mailHeader}" style="object-fit:cover;width:80%; margin:auto; margin-left:10%;margin-bottom:50px"/>
    template += `<div style="width:100% !important;  text-align:center;"><div style="background: #E6AF2A; margin-bottom:20px; padding-top:20px ;padding-bottom:20px;"> <h2>Your Repayment Plan</h2></div></div>`
    let p = Number(loanAmount.replace(/[^0-9.-]+/g, ""));
    let n = tenure;
    let m = monthlyRepayment.toString();
    let i = rate;
    let tp = "Monthly";
    let period = "month";
    if (n.toLowerCase().includes("day")) {
      //   m =  dataSet["Daily Repayment"];
      period = "day";
      tp = "Daily"
    }
    console.log(n.toLowerCase());
    if (n) { n = parseInt(n.split(' ')[0].trim()); }
    template += `
        <div style="width:100%;">
        <div style="color:#333333;padding-top:10px; padding-bottom:10px; width:100%; justify-content:space-between;">
                      <p style="padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333; justify-content:space-between; color:#E6AF2A;">Purpose</p><p style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${this._utilService.titleCase(purpose)}</p>
                    </div>
                    <div style="color:#333333;padding-top:10px; padding-bottom:10px; width:100%;  justify-content:space-between;">
                      <p style="padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333; color:#E6AF2A;">Type</p><p style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${this._utilService.titleCase(loanType)}</p>
                    </div>  
                    </div>
                    <div style="width:100%;position:relative;">
                    <br/><br/>
                    <h3>Loan Information</h3>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100% !important; margin-bottom:60px;  border:1px solid #e0e0e0; font-size:12px !important;">
                    <tbody style="width:100%">
                    
                    <tr style="color:#333333;padding-top:10px; padding-bottom:10px;">
                      <td style="padding-left:10px;padding-top:10px; border-bottom:1px solid #e0e0e0; padding-bottom:10px;background: #333333; color:#E6AF2A;">Loan Amount <b>(NGN)</b></td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${loanAmount.replace("NGN", '').trim()}</td>
                    </tr> 
                    <tr style="color:#333333">
                      <td style="border-bottom:1px solid #e0e0e0;padding-left:10px;padding-top:10px; padding-bottom:10px;background: #333333;color:#E6AF2A;">Chosen Tenure</td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;border:1px solid #e0e0e0;">${this._utilService.titleCase(tenure)}</td>
                    </tr>
                    
                    <tr>
                      <td style="padding-left:10px;padding-top:10px; padding-bottom:10px;color: #333333; font-weight:bold;">${this._utilService.titleCase(tp)}  Installment <b>(NGN)</b></td><td style="padding-left:10px;padding-top:10px; padding-bottom:10px;color: #333333;background:#e0e0e0;"><b>${this._utilService.currencyFormatter(this._utilService.convertToPlainNumber(m)).replace("NGN", '').trim()}</b></td> 
                    </tr>
                    </tbody>
        </table>
        </div>
        <div style="width:100%; position:relative;">
        <h3>Repayment Schedule</h3>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100% !important; font-size:12px !important; border:1px solid #e0e0e0;">
                    <thead style="width:100%;">
                      <tr style="text-align:center; width:100%; color:#E6AF2A; background:#333333; padding-top:10px; padding-bottom:10px;">
                        <th style="padding-top:10px; padding-bottom:10px;">Payment Date</th>
                        <th style="padding-top:10px; padding-bottom:10px;">Loan Balance <b>(NGN)</b></th>
                        <th style="padding-top:10px; padding-bottom:10px;">Principal Repayment <b>(NGN)</b></th>
                        <th style="padding-top:10px; padding-bottom:10px;">Interest Repayment <b>(NGN)</b></th>
                        <th style="padding-top:10px; padding-bottom:10px;">Loan Repayment <b>(NGN)</b></th>
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
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utilService.currencyFormatter(beginning).replace("NGN", '').trim()}</td>
                                  
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utilService.currencyFormatter(monthlyPrincipal).replace("NGN", '').trim()}</td>
                                  
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utilService.currencyFormatter(monthlyInterest).replace("NGN", '').trim()}</td>
                                  <td  style="padding-top:10px; padding-bottom:10px; padding-left:1%;border:1px solid #e0e0e0;">${this._utilService.currencyFormatter(m).replace("NGN", '').trim()}</td>
                                </tr>`
      beginning = beginning - monthlyPrincipal;
    }
    template += `<tr style="style="width:100%" background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;"><td style="padding-left:10px;background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;" colspan="4">Total Repayment (Principal + Interest)</td><td style="padding-left:10px;background:#e0e0e0; font-weight:700 !important; padding-top:10px; padding-bottom:10px;">${this._utilService.currencyFormatter(total).replace("NGN", '').trim()}</td></tr></tbody></table></div>`

    return template;
  }
}