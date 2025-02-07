import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}