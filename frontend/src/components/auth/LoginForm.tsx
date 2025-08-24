import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error?: string | null;
  onClearError: () => void;
}

const LoginForm = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
}: LoginFormProps) => {

  /* Local state for form inputs */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* Handlers */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      console.error('Email and password are required');
      return;
    }

    await onSubmit(email, password); // Call the parent handler
  };

  const handleInputChange = () => {
    if (error) {
      onClearError(); // Clear error when user starts typing
    }
  };

  return (
    <div className="page-background-auth">
      <div className="auth-container">

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
            fullWidth={true}
          >
            Log in
          </Button>
        </form>

        {/* Registration section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? 
            <Link 
              to="/register"
              className="text-green-500 hover:text-green-600 cursor-pointer font-semibold ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;