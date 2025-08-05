import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: ('admin' | 'seeker' | 'provider')[];
  fallbackPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/' 
}: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-deep-teal">جاري التحقق من الصلاحيات...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  // If roles are required, check if user has any of the required roles
  if (requiredRoles.length > 0 && !requiredRoles.some(role => user.roles.includes(role))) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authenticated and has required roles, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute; 