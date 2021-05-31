import { AdditionalInfo } from "./business/additional-info/additional-info";
import { CollateralInfo } from "./business/collateral-info/collateral-info";
import { CompanyInfo } from "./business/company-info/company-info";
import { ShareholderInfo } from "./business/shareholder-info/shareholder-info";
import { EmploymentInfo } from "./personal/employment-info/employment-info";
import { NOKInfo } from "./personal/nok-info/nok-info";
import { PersonalInfo } from "./personal/personal-info/personal-info";
import { AccountInfo } from "./shared/account-info/account-info";
import { LoanDetails } from "./shared/loan-calculator/loan-details";

export interface BaseLoanApplication{
    applyingAs:string;
    loanProduct:string;
    loanType:string;
    documents:Document[];
    accountInfos:AccountInfo[];
    loanDetails:LoanDetails;
}

export interface PersonalLoanApplication extends BaseLoanApplication{
    bvn:string;
    personalInfo:PersonalInfo;
    employmentInfo:EmploymentInfo;
    nokInfo:NOKInfo;
}

export interface BusinessLoanApplication extends BaseLoanApplication{
    additionalInfo:AdditionalInfo;
    companyInfo:CompanyInfo;
    shareholderInfos:ShareholderInfo[];
    collateralInfo:CollateralInfo;
}