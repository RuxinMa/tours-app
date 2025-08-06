import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, clearError } from '../store/slices/authSlice';

import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const LoginPage = () => {
  /* State Management */
  // 1️⃣ Local state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2️⃣ Location state for redirect after login
  const location = useLocation();

  // 3️⃣ Redux state
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  /* Handlers */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      console.error('Email and password are required');
      return;
    }

    await dispatch(loginUser({ email, password })); // Dispatch login action
  };

  const handleInputChange = () => {
    if (error) {
      dispatch(clearError()); // Clear error when user starts typing
    }
  };

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
          Welcome to Tours App
        </h1>

        {/* Error message*/}
        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Email Input*/}
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
            required
          />

          {/* Submit */}
          <Button
            type="submit"
            loading={isLoading}
            disabled={!email || !password}
            variant="primary"
            size="md"
          >
            Log in
          </Button>
        </form>

        {/* Registration section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? 
            <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold ml-1">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
