import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface ProtectRouteProps {
  children: React.ReactNode; // The component to protect
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth); // 
  const location = useLocation();

  // 1️⃣ User is authenticated, render the children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 2️⃣ User is not authenticated, redirect to login page
  return (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectRoute;