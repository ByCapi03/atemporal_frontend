import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import type { RolId } from '../../types/roles';

interface ProtectedRouteProps {
  allowedRoles: RolId[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, roleId } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleId && !allowedRoles.includes(roleId)) {
    // Redirect to home if user does not have permission
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
