const newSessionRoutes = [{ path: '/api/auth/login', method: 'POST' },{ path: '/api/auth/register', method: 'POST' },
{ path: '/api/auth/token', method: 'POST' },];
const authRoutes = [
  { path: '/api/auth/password', method: 'PUT' },
  { path: '/api/users/new', method: 'POST' },
  { path: '/api/auth/logout', method: 'GET' },
  { path: '/api/users', method: 'GET' },
  { path: '/api/investments', method: 'GET' },
  { path: '/api/investments/new', method: 'POST' },
  { path: '/api/loans', method: 'GET' },
  { path: '/api/loans/new', method: 'POST' },
  { path: '/api/files/upload', method: 'POST' },
  { path: '/api/files/merge_chunks', method: 'POST' }
];

module.exports={
    newSessionRoutes,
    authRoutes
}