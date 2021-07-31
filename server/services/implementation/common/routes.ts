export const newSessionRoutes = [{ path: '/api/auth/login', method: 'POST' }, { path: '/api/auth/register', method: 'POST' },
{ path: '/api/auth/token', method: 'POST' },
{ path: '/api/repayment/plan', method: 'POST' },
{ path: '/api/investments/apply', method: 'POST' },
{ path: '/api/account/enquiry', method: 'POST' }, { path: '/api/common/validatebvn', method: 'POST' }, { path: '/api/auth/verify', method: 'POST' }, { path: '/api/auth/resetpassword', method: 'POST' }];
export const authRoutes = [
  { path: '/api/auth/password', method: 'PUT' },
  { path: '/api/notification/send', method: 'POST' },
  { path: '/api/notification/sendtomultiple', method: 'POST' },
  { path: '/api/notification/subscribe', method: 'POST' },
  { path: '/api/notification/notifyCustomer', method: 'POST' },
  { path: '/api/users/create', method: 'POST' },
  { path: '/api/auth/logout', method: 'GET' },
  { path: '/api/auth/passwordChange', method: 'PUT' },
  { path: '/api/users', method: 'GET' },
  { path: '/api/investments', method: 'GET' },
  { path: '/api/account', method: 'GET' },
  { path: '/api/account/updateAccounts', method: "POST" },
  { path: '/api/loans/getLatestLoan', method: 'GET' },
  { path: '/api/loans/search', method: 'POST' },
  { path: '/api/loans/create', method: 'POST' },
  { path: '/api/loans', method: 'GET' },
  { path: '/api/loans/searchToProcess', method: 'POST' },
  { path: '/api/loans/updateStatus', method: 'POST' },
  { path: '/api/loans/getLoanDetails', method: 'GET' },
  { path: '/api/loans/getLoanLogDetails', method: 'GET' },
  { path: '/api/loans/getDisbursedLoan', method: 'GET' },
  { path: '/api/repayment/getRepayments', method: 'GET' },
  { path: '/api/repayment/getRepaymentHealth', method: 'GET' },
  { path: '/api/repayment/repay', method: 'POST' },
  { path: '/api/customer', method: 'GET' },
  { path: '/api/customer/all', method: 'GET' },
  { path: '/api/customer/bvn', method: 'GET' },
  { path: "/api/customer/getById", method: "GET" },
  { path: '/api/customer/employers', method: 'GET' },
  { path: '/api/customer/companies', method: 'GET' },
  { path: '/api/customer/nok', method: 'GET' },
  { path: '/api/customer/updateCustomerBVN', method: 'PUT' },
  { path: '/api/customer/collaterals', method: 'GET' },
  { path: '/api/customer/update', method: 'PUT' },
  { path: '/api/customer/updateNOK', method: 'PUT' },
  { path: '/api/customer/shareholders', method: 'POST' },
  { path: '/api/document/upload', method: 'POST' },
  { path: '/api/document/download', method: 'POST' },
  { path: '/api/document/getAll', method: 'GET' },
  { path: '/api/files/merge_chunks', method: 'POST' }
];

