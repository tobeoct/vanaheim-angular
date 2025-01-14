import { VerifyVerificationType } from "server/enums/verify/verification-type";

export interface VerifyRequest  {
    transactionReference: string
    searchParameter: string
    verificationType: VerifyVerificationType
  }

  export interface VerifyAccountEnquiryRequest extends VerifyRequest {
    bankCode: string
  }