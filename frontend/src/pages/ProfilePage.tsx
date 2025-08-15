import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { userMenuItems, adminMenuItems } from '../components/profile/menuItem';
// Components
import MainLayout from '../components/layout/MainLayout';
import ProfileMenu from '../components/profile/ProfileMenu';
import ProfileSettings from '../components/profile/account/ProfileSettings';
import ProfileBookings from '../components/profile/bookings/ProfileBookings';
import ProfileReviews from '../components/profile/reviews/ProfileReviews';
import ProfileBilling from '../components/profile/billing/ProfileBilling';

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  // Function to get the active menu item based on the current hash
  const getActiveMenuItemFromHash = (hash: string): string => {
    const hashValue = hash.replace('#', '');
    if (!hashValue) return 'settings';
    
    const validMenuItems = ['settings', 'bookings', 'reviews', 'billing'];
    const validAdminItems = ['admin-tours', 'admin-users', 'admin-reviews', 'admin-bookings'];
    const allValidItems = [...validMenuItems, ...validAdminItems];

    if (validAdminItems.includes(hashValue)) {
      // Check if user is admin
      if (user?.role !== 'admin') {
        console.warn('Access denied: Admin privileges required');
        // Redirect to default page
        window.history.replaceState(null, '', '/me');
        return 'settings';
      }
      return hashValue;
    }

    return allValidItems.includes(hashValue) ? hashValue : 'settings';
  };

  const [activeMenuItem, setActiveMenuItem] = useState<string>(
    getActiveMenuItemFromHash(location.hash)
  );
  
  // Update active menu item when location hash changes
  useEffect(() => {
    const newActiveItem = getActiveMenuItemFromHash(location.hash);
    setActiveMenuItem(newActiveItem);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash]);

  const handleMenuItemClick = (menuId: string) => {
    setActiveMenuItem(menuId);
    
    // Update URL hash without reloading the page
    if (menuId === 'settings') {
      // If settings, remove hash
      window.history.replaceState(null, '', '/me');
    } else {
      window.history.replaceState(null, '', `/me#${menuId}`);
    }
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'settings':
        return <ProfileSettings />;
      case 'bookings':
        return <ProfileBookings />;
      case 'reviews':
        return <ProfileReviews />;
      case 'billing':
        return <ProfileBilling />;
      case 'admin-tours':
      case 'admin-users':
      case 'admin-reviews':
      case 'admin-bookings':
        return (
          <div className="p-6 flex flex-col items-center justify-center min-h-[650px]">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">🚧 Under Construction</h2>
            <p className="text-gray-600">This admin feature is coming soon!</p>
          </div>
        );
      default:
        return <ProfileSettings />; // Default to settings if no match
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:grid md:grid-cols-4 min-h-[650px]">
            <div className="md:col-span-1 md:border-r border-gray-200 h-full">
              <ProfileMenu
                userMenuItems={userMenuItems}
                adminMenuItems={isAdmin ? adminMenuItems : []}
                activeMenuItem={activeMenuItem}
                onMenuItemClick={handleMenuItemClick}
                user={user}
              />
            </div>
            <div className="md:col-span-3 min-h-[650px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;