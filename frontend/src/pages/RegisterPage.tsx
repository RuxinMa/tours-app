import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const RegisterPage = () => {
  /* State Management */
  // 1️⃣ Local state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 2️⃣ Location state for redirect after login
  const location = useLocation();

  // 3️⃣ Use custom hook for authentication logic
  const { 
    user, 
    isLoading, 
    error, 
    isAuthenticated, 
    register, 
    clearError 
  } = useAuth();

  /* Handlers */
  const handlePasswordValidation = () => {
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      console.error('Name, email, password, and confirm password are required');
      return;
    }
    await register({ name, email, password }); // Dispatch register action
  };

  const handleInputChange = () => {
    if (error) {
      clearError(); // Clear error when user starts typing
    }
  };

  const canSubmit = name && email && password && confirmPassword && !passwordError;

  /* Success State */
  if (isAuthenticated && user) {
    const redirectTo = location.state?.from?.pathname || '/';
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="page-background-auth">
      <div className="card-container">

        {/* Title */}
        <h1 className="form-title">
          Create an Account
        </h1>

        {/* Error message*/}
        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Name Input*/}
          <FormInput
            id="name"
            name="name"
            type="text"
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleInputChange();
            }}
            required
          />
          
          {/* Email Input */}
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleInputChange();
            }}
            required
          />

          {/* Password Input */}
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handleInputChange();
            }}
            onBlur={handlePasswordValidation} // Validate on blur for both password fields
            error={passwordError} // Show error if passwords do not match
            required
          />

          {/* Password Confirm Input */}
          <FormInput
            id="confirmPassword"
            name="confirmPassword" 
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              handleInputChange();
            }}
            onBlur={handlePasswordValidation} // Validate on blur for both password fields
            error={passwordError} // Show error if passwords do not match
            required
          />

          {/* Submit */}
          <Button
            type="submit"
            loading={isLoading}
            disabled={!canSubmit}
            variant="primary"
            size="md"
            fullWidth={true}
          >
            Sign Up
          </Button>
        </form>

        {/* Login section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? 
            <Link
              to='/login' 
              className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
