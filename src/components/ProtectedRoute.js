import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem('jwt');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" redirect />;
}

export default ProtectedRoute;