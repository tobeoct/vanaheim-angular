import { EmploymentInfo } from "../loan/personal/employment-info/employment-info";
import { NOKInfo } from "../loan/personal/nok-info/nok-info";
import { AccountInfo } from "../earnings/account-info/account-info";
import { Document } from "../loan/shared/document-upload/document";
import { EarningIndication } from "../welcome/earnings/earning";
import { EarningsPersonalInfo } from "./personal-info/personal-info";

export interface EarningApplication{
    investmentDetails:EarningIndication,
    meansOfIdentification:MeansOfIdentification;
    personalInfo:EarningsPersonalInfo;
    employmentInfo:EmploymentInfo;
    accountInfo:AccountInfo;
    nokInfo:NOKInfo
}

export interface MeansOfIdentification{
    document:Document,
    idNumber:string,
    issueDate:Date,
    expiryDate:Date
}