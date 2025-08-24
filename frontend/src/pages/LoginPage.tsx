import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  /* Navigation */
  const navigate = useNavigate();
  const location = useLocation();

  /* Authentication Hook */
  const { 
    isLoading, 
    error, 
    login, 
    clearError 
  } = useAuth();

  /* Handlers */
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    
    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
      onClearError={clearError}
    />
  );
};

export default LoginPage;
