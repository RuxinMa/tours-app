import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, clearError } from '../store/slices/authSlice';

import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const LoginPage = () => {
  // State Management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redux state
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      console.error('Email and password are required');
      return;
    }
    
    await dispatch(loginUser({ email, password }));
  };

  const handleInputChange = () => {
    if (error) {
      dispatch(clearError());
    }
  };

  // Success state
  if (isAuthenticated && user) {
    return (
      <div className="page-background-success">
        <div className="card-container-sm">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="success-title">Welcome Back!</h2>
          <p className="text-gray-600 mb-4">You have successfully logged in to Natours</p>

          {/* User Information */}
          <div className="bg-gray-50 p-4 rounded text-left text-sm">
            <div><strong>Name:</strong> {user.name}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Role:</strong> {user.roles}</div>
          </div>
          
          <Button 
            onClick={() => window.location.reload()}
            variant="secondary"
            size="sm"
            className="mt-4 max-w-xs mx-auto"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
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