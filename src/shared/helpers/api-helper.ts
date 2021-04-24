 const INVESTMENTS = "/api/investments"
 const LOANS = "/api/loans"
 const USERS = "/api/users"
 const REPAYMENTS = "/api/repayments"
 const COMMON = "/api/common"
 const FILES = "/api/files"

 export const NEW_INVESTMENTS = INVESTMENTS + "/new";
 export const GET_INVESTMENTS = INVESTMENTS;

 export const GET_LOANS = LOANS;
 export const NEW_LOANS = LOANS + "/new";

 export const GET_USERS = USERS;
 export const NEW_USERS = USERS + "/new";

 export const GET_REPAYMENTS = REPAYMENTS;
 export const SEND_REPAYMENTS = REPAYMENTS + "/send";
 
 export const ACCOUNT_ENQUIRY = COMMON + "/accountenquiry";
 export const BVN_VALIDATION = COMMON + "/validatebvn";
 export const FEEDBACK = COMMON+"/feedback";
 
 export const FILES_UPLOAD = FILES + "/upload";
 export const FILES_MERGE= FILES + "/merge_chunks";