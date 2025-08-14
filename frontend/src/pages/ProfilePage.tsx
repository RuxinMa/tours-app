import MainLayout from '../components/layout/MainLayout';
import { useState } from 'react';
import { useAppSelector } from '../hooks/redux';
import { userMenuItems, adminMenuItems } from '../components/profile/menuItem';

import ProfileMenu from '../components/profile/ProfileMenu';
import ProfileSettings from '../components/profile/ProfileSettings';
import ProfileBookings from '../components/profile/ProfileBookings';

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('settings');

  const isAdmin = user?.role === 'admin';

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'settings':
        return <ProfileSettings />;
      case 'bookings':
        return <ProfileBookings />;
      case 'reviews':
        return <div className="p-6">Reviews Component - Coming Soon</div>;
      case 'billing':
        return <div className="p-6">Billing Component - Coming Soon</div>;
      case 'admin-tours':
      case 'admin-users':
      case 'admin-reviews':
      case 'admin-bookings':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">🚧 Under Construction</h2>
            <p className="text-gray-600">This admin feature is coming soon!</p>
          </div>
        );
      default:
        return <div className="p-6">Settings Component - Coming Soon</div>;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
            <div className="lg:col-span-1 border-r border-gray-200 h-full">
              <ProfileMenu
                userMenuItems={userMenuItems}
                adminMenuItems={isAdmin ? adminMenuItems : []}
                activeMenuItem={activeMenuItem}
                onMenuItemClick={setActiveMenuItem}
                user={user}
              />
            </div>
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;