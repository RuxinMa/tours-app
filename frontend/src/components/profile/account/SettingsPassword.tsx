/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { SettingsForm, FormTitle }from '../../layout/SettingsForm';
import Button from '../../common/Button';

const SettingsPassword = () => {
  const [passwordForm, setPasswordForm] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: ''
  });

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Handle password update
  const handleUpdatePassword = async () => {
    setIsUpdatingPassword(true);
    setPasswordError('');

    try {
      if (!passwordForm.passwordCurrent) {
        throw new Error('Current password is required');
      }

      if (passwordForm.password.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      if (passwordForm.password !== passwordForm.passwordConfirm) {
        throw new Error('New password and confirmation do not match');
      }

      // Make API call to update password
      const response = await fetch('/api/v1/users/updateMyPassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          passwordCurrent: passwordForm.passwordCurrent,
          password: passwordForm.password,
          passwordConfirm: passwordForm.passwordConfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      // Success feedback
      alert('Password updated successfully!');
      // Reset form
      setPasswordForm({
        passwordCurrent: '',
        password: '',
        passwordConfirm: ''
      });
      
    } catch (error: any) {
      setPasswordError(error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <FormTitle 
        title="Change Password" 
        icon={<FiLock className='text-emerald-400' />}
      />

      <div className="space-y-6">
        {/* Current Password */}
        <SettingsForm
          label="Current Password"
          type="password"
          value={passwordForm.passwordCurrent}
          onChange={(value) => setPasswordForm({...passwordForm, passwordCurrent: value})}
          placeholder="Enter your current password"
        />
        {/* New Password */}
        <SettingsForm
          label="New Password"
          type="password"
          value={passwordForm.password}
          onChange={(value) => setPasswordForm({...passwordForm, password: value})}
          placeholder="Enter your new password (min. 8 characters)"
        />
        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={passwordForm.passwordConfirm}
            onChange={(e) => setPasswordForm({...passwordForm, passwordConfirm: e.target.value})}
            className="w-full md:text-base text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Confirm your new password"
            required
          />
          {passwordForm.password && passwordForm.passwordConfirm && 
            passwordForm.password !== passwordForm.passwordConfirm && (
            <p className="text-red-500 text-xs mt-1">
              Passwords do not match
            </p>
          )}
        </div>

        {/* Error Message */}
        {passwordError && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {passwordError}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
          onClick={handleUpdatePassword}
          disabled={isUpdatingPassword}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingPassword ? 'Updating...' : 'Change Password'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPassword;