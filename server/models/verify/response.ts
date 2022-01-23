import { VerifyVerificationStatus } from "@enums/verify/verification-status";
import { VerifyVerificationType } from "@enums/verify/verification-type";

export interface  VerifyResponse<T> {
    responseCode: string,
    description: string,
    verificationType: VerifyVerificationType,
    verificationStatus: VerifyVerificationStatus,
    transactionStatus: string,
    transactionReference: string,
    transactionDate: string,
    searchParameter: string,
    response: T,
    faceMatch: string,
  }
 export type VerifyAccountEnquiryResponsePayload = {
  
    full_name: string,
    bank_name: string,
    account_number: string,
    bank_code: string,
    message: string,
  
  }

  export type VerifyBVNResponsePayload = {
  
    validity:string;
    bvn:string;
    status:string;
    basicDetailBase64:string;
    description:string;
    imageBase64:string;

  
  }