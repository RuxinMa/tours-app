import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  /* Navigation */
  const location = useLocation();

  /* Authentication Hook */
  const { 
    user, 
    isLoading, 
    error, 
    isAuthenticated, 
    register, 
    clearError 
  } = useAuth();

  /* Handlers */
  const handleSubmit = async (formData: RegisterFormData) => {
    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      // Note: confirmPassword is handled in the form validation
    });
  };

  /* Success State */
  if (isAuthenticated && user) {
    const redirectTo = location.state?.from?.pathname || '/';
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      onClearError={clearError}
    />
  );
};

export default RegisterPage;
