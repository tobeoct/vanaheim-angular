export interface IRepaymentService{
    processRepaymentPlan:({ email,tenure,loanType,denominator,purpose, rate, loanAmount, monthlyRepayment }:any)=>Promise<any>;

}
