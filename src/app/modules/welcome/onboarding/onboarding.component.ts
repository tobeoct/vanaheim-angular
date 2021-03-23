import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetPath } from 'src/shared/constants/variables';
import {IAssetPath} from "../../../../shared/interfaces/assetpath";
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  constructor(private router: Router) { }
  assetPaths: IAssetPath = new AssetPath;
main:string="main";
nested:string="nested"
navtype:string = "onboarding";
headerclass:string ="header_mobi";
isClicked: boolean = false;
 faqGroups: any[] = [
  {
      title:"General Information",
      data:[{
          question:"Is Vanir Capital a bank ?",
          answer:`No. We are a financial institution with a growth path to becoming a player in the Fintech Industry. We operate with a money lending license and are currently one of the leading players 
  in the money lending sector.`
      },{
          question:"What services do Vanir Capital Offer ?",
          answer:`We offer consumer and capital finance solutions, we also provide investment for investors looking to earn passive income.`
      },{
          question:"Is Vanir Capital Licensed ?",
          answer:`Vanir Capital LLC is a registered financial Institution with the CAC, and a licensed money lending company with the Ministry of Home Affairs, Nigeria.`
      },{
          question:"Who is behind Vanir Capital ?",
          answer:`Vanir Capital is run by finance and technology professionals with over 30 years finance and technology domain experience. You’re rest assured your business dealings with the organization are in secured and safe hands. Read More about the team.`
      },
      {
          question:"Where is Vanir Capital Located? ",
          answer:`16B, Aliu Animashaun Avenue, Lekki phase 1, Lagos state.`
      },
  ]
  },
  {
      title:"Loans, Salary Earner Loans, Bankers Credit and Loan Repayment",
      data:[{
          question:"What financing solutions are available ?",
          answer:`<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Salary earner loans</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>LPO financing</div></li> 
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Line of Credit</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Business Loans</div></li>`
      },{
          question:"What is a Salary Earner loan and how do I apply ?",
          answer:`Loans for salary earners, also known as Payday loans are short-term borrowings to be repaid upon receipt of your monthly salary. Click on Get a Loan button to apply`
      },{
          question:"What is a Line of Credit and how do I apply?",
          answer:`A line of credit is the maximum amount of credit that a financial institution makes
available for a borrower to access. You can draw from the line of credit when you
need it, up to the maximum amount.<br/> <br/>
Vanir Capital currently offers business line of credits to organizations that need
access to working capital.<br/><br/>
To apply for one, click on the Get a Loan button or call +234 818 027 9270 for more
information
`
      }
      ,{
          question:"What is LPO Financing ?",
          answer:`This is a loan facility designed to provide short term financing to customers to pay their suppliers upfront for verified purchase orders.`
      },{
          question:"How do I apply for a loan ?",
          answer:`Click on the <b>Get a loan</b> button on this page`
      },{
          question:"How much can I borrow ? For how long ?",
          answer:`Maximum amount is N1,000,000. Loan request above N1,000,000 will require a “Quick-to-Cash” collateral. This typically includes, landed property(ies) and other Fixed Assets; the value of which should be estimated at 1.5 times (150%) the value of the loan request.`
      },{
          question:"How long does it take to process a loan?",
          answer:`The loan process can be completed within 24 hours provided all documents are valid during the application process.`
      },{
          question:"Why is my Bank Verification Number (BVN) required?",
          answer:`This is a CBN policy applicable to financial institutions as part of Know Your Customer (KYC) requirements.`
      },{
          question:"I don't know my BVN. What do I do?",
          answer:`Dial *565*0# from your registered BVN phone number or visit any branch of your bank for assistance.`
      },{
          question:"What are the required documents for a Personal Loan at Vanir Capital?",
          answer:`
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>A valid means of Identification (International Passport, Driver's License or National ID card)</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>You will be required to fill Vanir Capital's "loan application form" (This can be provided upon request)</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Employee ID Card</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Salary account bank statement for the last Six (6) months and BVN</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>NUBAN Cheques or Direct Debit Mandate</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Employment offer letter</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Verifiable utility bill (PHCN BILL)</div></li>`
      },
      {
          question:"What are the required documents for a Business Loan at Vanir Capital?",
          answer:`
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Valid means of Identity of two directors (Voter’s card, National ID card, Valid Driver’s License, Valid International passport).</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Business account bank statement for the last Six (6) months.</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Postdated cheques for the monthly amount will be required as a part of your repayment plan.</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Evidence of previously executed contracts (POs, contract agreements, completion certificates, payment invoices etc.)</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Business registration / incorporation details and documents</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Signed MOUs on current contract</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Supplier Invoices on current contract</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>T&C of contract (Full contract)</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Application letter on company letterhead</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Board resolution for loan request</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Filled guarantors form for at least two directors</div></li>`
      },
      {
          question:"What are the required documents for an LPO at Vanir Capital?",
          answer:`
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Valid means of Identity (Voter’s card, National ID card, Valid Driver’s License or Valid International passport)</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Business account statement for the last Six (6) months till date.</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>A completed loan application form (to be attached).</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Postdated cheques issued to the tune of the monthly repayment amount.</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>A brief of your business and the reason for accessing the loan.</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Copy of your business registration documents from CAC</div></li>`
      }
      ,{
          question:"Can I apply for a loan from any location?",
          answer:`Yes, you can. Kindly send an email to <strong><u>loans@vanircapital.org</u></strong> However, only Lagos and Port Harcourt based residents can currently have access to our loans.`
      },{
          question:"Why was my loan application rejected?",
          answer:`This may happen if the information provided by you does not meet the minimum requirements to access a loan.`
      },{
          question:"How do I repay my loan?",
          answer:`You can repay with cheques, a direct debit mandate or simply transfer the funds to Vanir Capital Limited's bank account details below: <br/>
  
  Account name:VANIR CAPITAL LTD<br/>
  Bank: ZENITH BANK<br/>
  Account number:1015813603`
      },{
          question:"How can I make an early repayment?",
          answer:`You can send an email to <strong><u>loans@vanircapital.org</u></strong> requesting for the outstanding amount on your loan. A response would 
be sent by our team providing the exact amount to be remitted and account details where payment should be made. 
`
      },{
          question:"If I make an early repayment will I pay less or will there be a penalty?",
          answer:`There is no penalty for early repayment, interest rates are charged per cycle (monthly) hence the applicable interest rate for the month will be charged.`
      },{
          question:"What happens if I am late on repayment?",
          answer:`The default penalty is 1% on instalment amount for each day of loan default for a
maximum of Seven (7) days. If payment is yet to be received after 7 days, accrued
penal charges and interest due will be rolled over into the principal amount and
recalculated which will lead to higher repayment.`
      },{
          question:"Can I reschedule my loan repayment date?",
          answer:`Yes, you can change your repayment date, but charges will apply.`
      },{
          question:"What happens if I don't pay back my loan?",
          answer:`If the default passes 30 days, more stringent measures may be applied which may include:
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Reporting defaulter to his/her employer</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Reporting defaulter to Credit Bureau</div></li>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Recovery measures will be taken</div></li>`
      },{
          question:"Can I have more than one loan at a time?",
          answer:`No, an existing loan must be completely paid out before applying for new loan.`
      },
      {
          question:"Can I have more than one loan at a time?",
          answer:"No, an existing loan must be completely paid out before applying for new loan."
      }
  ]
  },{
      title:"Fees, Charges and Taxes",
      data:[{
          question:"Are there fees on loans?",
          answer:`There are no hidden/extra fees on the loans. Only the interest rate is applied.`
      },
      {
          question:"Are there hidden charges?",
          answer:"There are no hidden charges on our loans. The rates are clearly stated in the offer letters sent to customers."
      }
      ,{
          question:"Are there fees on investments?",
          answer:`A one-off fee of 0.5% Flat on Total Principal Amount managed by Vanir Capital. This is charged on rollovers, investment top-ups and new investments and charged upfront. <br/>
This fee is the cost of having your portfolio professionally managed by Vanir Capital.<br/>
  

 <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div> MANAGEMENT FEE:<br/><br/> A one-off fee of 0.5% Flat on Total Principal Amount managed by Vanir Capital. This is charged on rollovers, investment top-ups and new investments and charged upfront. <br/><br/>
This fee is the cost of having your portfolio professionally managed by Vanir Capital.</div></li>
                
                  
                  
 <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div> STATUTORY TAX (With-Holding Tax):<br/><br/> 10% On Accrued Interest monthly. This charge is mandatory and fixed by government.<br/> <br/>This is WHT (With-Holding
Tax) which is 10% flat of every income as directed by law, and will be deducted from your monthly interest and remitted to the FIRS (Federal Inland Revenue Service).<br/><br/> Your Tax Identification Number which is a requirement for tax remittances would need to be provided and a tax credit note will be provided to all investors at the end of the year.</div></li>
               
  <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>PREMATURE LIQUIDATION FEE:<br/><br/> The Pre-Liquidation charge is a penal charge implemented upon early liquidation (Part or Full) of investments. For full liquidations, One-month notice and forfeiture of interest due for the month. <br/><br/>
For part liquidations, One-month notice and 1% of liquidated amount.<br/><br/>
This charge is calculated and deducted before the requested investment principals or returns are paid.</div></li>`
      },{
          question:"Are there tax obligations on loans or investments?",
          answer:`Our loans are not taxed; however, the investment returns have a charge of 10% flat which would be deducted from your monthly interest and remitted to the FIRS (Federal Inland Revenue Service).`
      }
  ]
  },{
      title:"Credit Bureau and Credit Score",
      data:[{
          question:"What is a credit bureau?",
          answer:`This is a company that collects information relating to the financial performance with regards to credit facilities of both individuals and 
corporate bodies and makes this available to banks and finance companies.`
      },{
          question:"What is a credit score?",
          answer:`This is a number that relates to how likely you are to repay a debt. Banks and lenders use this to determine the risk level associated with 
approving loans for individuals or corporate bodies.`
      },{
          question:"How does Vanir Capital Work with the credit bureau?",
          answer:`Vanir Capital collects and also gives data on the credit history of customers who to the Credit Bureau.`
      }
  ]
  },{
      title:"Security and Privacy",
      data:[{
          question:"Can I trust Vanir Capital with my data?",
          answer:`When doing business with Vanir Capital your personal data and privacy is always
secure and kept confidential as stated in our privacy policy agreement.`
      },{
          question:"Who has access to my data?",
          answer:`Vanir Capital never shares your personal details with third parties, unless for dedicated business purposes, such as reporting to credit bureaus.`
      }
  ]
  },{
      title:"Investments and Returns",
      data:[
      {
          question:"How do I invest?",
          answer:`Kindly visit the <a href='https://app.vanircapital.org/investment' class="theme_color--yellow"><u>Investment Page</u></a> or <br/><br/>
          <li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Send a mail indicating interest to invest and request for the investment
account opening package to investments@VanirCapital.org or call +234
818 027 9270 for more information</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Scan and email signed documents to us at
investments@VanirCapital.org</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>After all forms have been received and approved, a transaction notice
will be sent from a designated relationship manager indicating Vanir 
Capital’s readiness to receive investment funds which will be paid into
the organizations corporate account</div></li>

          `
      }, 
      {
          question:"As an existing investor I would like to change my order, how do I go about it?",
          answer:`<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div> Send a mail requesting for a "Change Order" investments@VanirCapital.org or
call +234 818 027 9270</div></li>

<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div> In your communication, specify the required changes to amount and tenor</div></li>

<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>After the request have been received and approved, an updated letter of
investment and/or investment projection will be provided to you.</div></li>
`
      },{
          question:"How much can I invest?",
          answer:`Qualifying investment amounts starts from ₦250,000 to ₦50,000,000.`
      },{
          question:"How is interest calculated?",
          answer:`Interest rates are calculated based on the applicable investment tenor. The longer the investment period, the higher your rates.`
      },{
          question:"Can I have more than one investment plan? ",
          answer:`Yes. At any point in time, you can have several investment plans with us at Vanir Capital.`
      },{
          question:"Can I top up an existing investment?",
          answer:`YES. You can make additional investments on an existing plan by sending a request
to Vanir Capital and further information will be provided.`
      },{
          question:"Is there a fee to setup an investment account?",
          answer:`Not at all. It is absolutely Free to opt in and earn guaranteed interest on your investment, once you place the funds.`
      },{
          question:"What is a maturity date?",
          answer:`This is the beautiful day when your investment has completed the agreed time period, and you receive your full principal and/or interest pay-out to your account.`
      },{
          question:"How is my money protected?",
          answer:`Vanir Capital investments are protected through our comfort cheques, Internal processes and guidelines, fund provisioning, and external Insurance.`
      },{
          question:"How do I monitor my investments?",
          answer:`With Vanir Capital, you have full visibility on how your investment is growing via monthly notifications on your current earnings and Vanir Capital's MPRs. 

The monthly statements provide the following information:
<ul>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Balance: a sum of your current invested principal + any domiciled returns</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Lifetime Returns: The total amount of returns you've earned since investing in Vanir capital </div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Current Returns: Returns earned during the concluded cycle</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Projected Returns: The expected returns for future months</div></li></ul>`
      },{
          question:"Can I Opt-out of the scheme at any time?",
          answer:`Yes. Ideally a one-month notice is required for a liquidation of investments, however, Vanir Capital is willing to liquidate investments on demand at an administrative fee.`
      },{
          question:"How do I Opt-out?",
          answer:`Opting out is quite simple and require a one-month notice or payment of an early liquidation fee. To initiate an opt-out, follow the following these steps: <br/><br/>
<ul>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Send an email to investments@vanircapital.org</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Title your email "Investment Liquidation Request</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>State the specifics of your liquidation request</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>State the investment Plan you would like to Liquidate</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>State the amount to be liquidated if not full liquidation</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Specify account for funds transfer if different from account on file</div></li>
<li><div><i class="fas fa-dot-circle theme_color--yellow "></i></div><div>Send request</div></li></ul>`
      },{
          question:"Do I get a Certificate of Investment?",
          answer:`Yes. A Letter of Investment is provided, sealed and signed.`
      },{
          question:"How long can I invest for? ",
          answer:`Currently, available investment tenors are 3, 6 or 12 months. You can also re-invest
after an investment has matured.`
      }
  ]
  }
];

  ngOnInit(): void {
    
  }

  
onNavigate(route:string){
    this.router.navigate([route])
  }

}
