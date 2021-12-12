
import { NOKInfo } from "../loan/personal/nok-info/nok-info";
import { AccountInfo } from "../earnings/account-info/account-info";
import { Document } from "../loan/shared/document-upload/document";
import { EarningIndication } from "../welcome/earnings/earning";
import { EarningsPersonalInfo } from "./personal-info/personal-info";
import { EarningsEmploymentInfo } from "./employment-info/employment-info";

export interface EarningApplication {
    earningsCalculator: EarningIndication,
    meansOfIdentification: MeansOfIdentification;
    personalInfo: EarningsPersonalInfo;
    employmentInfo: EarningsEmploymentInfo;
    accountInfo: AccountInfo[];
    nokInfo: NOKInfo
}

export interface MeansOfIdentification {
    document: Document,
    type: IdentificationType
    idNumber: string,
    issueDate?: Date,
    expiryDate?: Date
}

export enum IdentificationType {
    InternationalPassport = "International Passport",
    DriversLicense = "Driver’s License",
    NationalIdentityCard = "National Identity Card",
    VotersCard = "Voters Card",
    Others = "Others"
}