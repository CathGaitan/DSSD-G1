import React from 'react';
import UnauthenticatedPage from '../pages/UnauthenticatedPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  authTier: 'local' | 'cloud'; // Requerimientos: local_token para 'local', y local_token + cloud_token para 'cloud'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, authTier }) => {
  const localToken = localStorage.getItem('local_token');
  const cloudToken = localStorage.getItem('cloud_token');
  
  if (!localToken) {
    return <UnauthenticatedPage authType="local" />;
  }

  if (authTier === 'cloud' && !cloudToken) {
    return <UnauthenticatedPage authType="cloud" />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;