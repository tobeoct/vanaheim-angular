export const newSessionRoutes = [{ path: '/api/auth/login', method: 'POST' },{ path: '/api/auth/register', method: 'POST' },
{ path: '/api/auth/token', method: 'POST' },
{ path: '/api/repayment/plan', method: 'POST' },
{ path: '/api/investments/apply', method: 'POST' },{ path: '/api/account/enquiry', method: 'POST'},{ path: '/api/common/validatebvn', method: 'POST'},{ path: '/api/auth/verify', method: 'POST' },{ path: '/api/auth/resetpassword', method: 'POST' }];
export const authRoutes = [
  { path: '/api/auth/password', method: 'PUT' },
  { path: '/api/notification/send', method: 'POST' },
  { path: '/api/notification/sendtomultiple', method: 'POST' },
  { path: '/api/notification/subscribe', method: 'POST' },
  { path: '/api/users/create', method: 'POST' },
  { path: '/api/auth/logout', method: 'GET' },
  { path: '/api/users', method: 'GET' },
  { path: '/api/investments', method: 'GET' },
  { path: '/api/loans/getLatestLoan', method: 'GET' },
  { path: '/api/loans/search', method: 'POST' },
  { path: '/api/loans/create', method: 'POST' },
  { path: '/api/loans', method: 'GET' },
  { path: '/api/document/upload', method: 'POST' },
  { path: '/api/document/download', method: 'POST' },
  { path: '/api/document/getAll', method: 'GET' },
  { path: '/api/files/merge_chunks', method: 'POST' }
];

