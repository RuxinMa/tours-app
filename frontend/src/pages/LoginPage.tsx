import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearError, loginUser } from '../store/slices/authSlice';

const LoginPage = () => {

  /* State Management */
  // 1️⃣ Local state for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2️⃣ Redux state for user authentication
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  /* Handlers */
  // 1️⃣ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  if (!email || !password) {
      console.error('Email and password are required');
      return;
  }
    // Dispatch login action
    await dispatch(loginUser({ email, password }));
  };

  // 2️⃣ Handle input changes
  const handleInputChange = () => {
    // Reset error state on input change
    if (error) {
      dispatch(clearError()); // Clear error when user starts typing
    }
  };

  // 3️⃣ Handle error messages
  if (error) {
    console.error('Login failed:', error);
  }

  /* Effects */
  // Redirect to home page if authenticated
  if (isAuthenticated) {
    // window.location.href = '/'; // Redirect to home page
     return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-green-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-green-800">Logged in!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-500 text-white p-8 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Log into your account
        </h1>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange();
                }}
              />
            </div>
        
            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleInputChange();
                }}
              />
            </div>
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !email || !password} // Disable if loading or fields are empty
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading || !email || !password
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
