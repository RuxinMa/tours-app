/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { useAuth } from '../../../hooks/useAuth';
import { getUserImageUrl } from '../../../services/utils/imageUtils';

import { FiCamera, FiUser } from 'react-icons/fi';
import { SettingsForm, FormTitle }  from '../../layout/SettingsForm';
import Button from '../../common/Button';

const SettingsBasic = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { updateProfile } = useAuth();

  const [basicInfo, setBasicInfo] = useState<{
    name: string;
    email: string;
    photo: string | null;
  }>({
    name: '',
    email: '',
    photo: null
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUpdatingBasic, setIsUpdatingBasic] = useState(false);
  const [basicError, setBasicError] = useState('');
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setBasicInfo({
        name: user.name || '',
        email: user.email || '',
        photo: user.photo || null
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading user information...</div>
      </div>
    );
  }

  // Handle avatar click to open file input
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setBasicInfo({...basicInfo, photo: previewUrl});
    }
  };

  // Basic information update function
  const handleUpdateBasicInfo = async () => {
    setIsUpdatingBasic(true);
    setBasicError('');

    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(basicInfo.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Name validation
      if (!basicInfo.name.trim()) {
        throw new Error('Name cannot be empty');
      }

      // Prepare form data
      const result = await updateProfile({
        name: basicInfo.name.trim(),
        email: basicInfo.email.trim(),
        photo: selectedFile ? URL.createObjectURL(selectedFile) : basicInfo.photo
      });

      if (result.success) {
        alert('Profile updated successfully!');
        setSelectedFile(null);
      } else {
        setBasicError(result.error || 'Update failed');
      }

    } catch (error: any) {
      setBasicError(error.message);
    } finally {
      setIsUpdatingBasic(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg md:p-8 p-6">
      <FormTitle 
        title="Basic Information" 
        icon={<FiUser className='text-emerald-400' />}
      />

      <div className="space-y-6">
        {/* Upload Avatar */}
        <div className="flex items-center md:space-x-8 space-x-4">
          <div className="relative cursor-pointer" onClick={handleAvatarClick}>
            <img
              src={getUserImageUrl(basicInfo.photo || '/img/users/default.jpg')}
              alt="Profile"
              className="w-16 md:w-24 md:h-24 rounded-full object-cover shadow-lg"
            />
            <div className="absolute bottom-0 right-0 bg-emerald-400 hover:bg-emerald-600 text-white rounded-full md:p-2 p-1 shadow-lg transition-colors">
              <FiCamera className='md:text-base text-sm' />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1 md:text-base text-sm">{user?.name}</h3>
            <p className="text-gray-400 md:text-sm text-xs">Click the camera icon to update your photo</p>
            {selectedFile && (
              <p className="text-emerald-400 md:text-sm text-xs mt-1">
                ✓ New photo selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Name Input */}
        <SettingsForm 
          label="Full Name"
          type="text"
          value={basicInfo.name}
          onChange={(value) => setBasicInfo({...basicInfo, name: value})}
          placeholder="Enter your full name"
        />

        {/* Email Input */}
        <SettingsForm 
          label="Email Address"
          type="email"
          value={basicInfo.email}
          onChange={(value) => setBasicInfo({...basicInfo, email: value})}
          placeholder="Enter your email address"
        />

        {/* Error Message */}
        {basicError && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {basicError}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant='primary'
            onClick={handleUpdateBasicInfo}
            disabled={isUpdatingBasic}
          >
            {isUpdatingBasic ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsBasic;