import { useState } from 'react';
import { Link } from 'react-router-dom';

import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (formData: RegisterFormData) => void;
  isLoading: boolean;
  error?: string | null;
  onClearError: () => void;
}

const RegisterForm = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
}: RegisterFormProps) => {

  /* Local state for form inputs */
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  /* Handlers */
  const handlePasswordValidation = () => {
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      console.error('Name, email, password, and confirm password are required');
      return;
    }
    await onSubmit(formData); // Call the parent handler
  };

  const handleInputChange = () => {
    if (error) {
      onClearError(); // Clear error when user starts typing
    }
  };

  const canSubmit = formData.name && formData.email && formData.password && formData.confirmPassword && !passwordError;

  return (
    <div className="page-background-auth">
      <div className="auth-container">

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
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
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
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
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
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
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
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
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
              className="text-green-500 hover:text-green-600 cursor-pointer font-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;