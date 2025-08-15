import { useState } from 'react';
import type { User }  from '../../types/user';
import { FiSettings, FiCalendar, FiStar, FiCreditCard, FiMap, FiUsers, FiChevronDown } from "react-icons/fi";

const iconMap = {
  settings: FiSettings,
  calendar: FiCalendar,
  star: FiStar,
  card: FiCreditCard,
  map: FiMap,
  users: FiUsers,
  chevron: FiChevronDown,
}; // Map icon names to React Icons components

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

interface ProfileMenuProps {
  userMenuItems: MenuItem[];
  adminMenuItems: MenuItem[];
  activeMenuItem: string;
  onMenuItemClick: (id: string) => void;
  user: User | null;
}

const ProfileMenu = ({ userMenuItems, adminMenuItems, activeMenuItem, onMenuItemClick, user }: ProfileMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMenuClick = (id: string) => {
    onMenuItemClick(id);
    setIsDropdownOpen(false);
  };

  const getActiveMenuLabel = () => {
    const allItems = [...userMenuItems, ...adminMenuItems];
    const activeItem = allItems.find(item => item.id === activeMenuItem);
    return activeItem?.label || 'Settings';
  };


  return (
    <>
      <div className="hidden md:block main-color p-4 shadow-sm text-white h-full flex-col">
        <div className='flex-1'>
          <ul className="space-y-4 mt-5">
            {userMenuItems.map((item) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap] || FiSettings; // icon fallback
              return (
                <li key={item.id}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeMenuItem === item.id
                      ? 'font-bold text-lg border-l-[5px] border-white -ml-4'
                      : 'hover:bg-white/10'
                    }`}
                    onClick={() => onMenuItemClick(item.id)}
                  >
                    <IconComponent className="inline-block mr-3" />
                    {item.label.toUpperCase()}
                  </button>
                </li>
              );
            })}
          </ul>

        {/* Render admin menu if user is an admin */}
        {user?.role === 'admin' && (
          <div className="mt-16">
            <h3 className="text-lg font-semibold mb-2 ml-2">Admin</h3>
            <hr className="mb-2" />

            <ul className="space-y-4 mt-5">
              {adminMenuItems.map((item) => {
                const IconComponent = iconMap[item.icon as keyof typeof iconMap] || FiSettings; // icon fallback
                return (
                  <li key={item.id}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeMenuItem === item.id
                      ? 'font-bold text-lg border-l-[5px] border-white -ml-4'
                      : 'hover:bg-white/10'
                    }`}
                    onClick={() => onMenuItemClick(item.id)}
                  >
                    <IconComponent className="inline-block mr-3" />
                    {item.label.toUpperCase()}
                  </button>
                </li>
                );
              })}
            </ul>
          </div>
        )}
        </div>
      </div>

      {/* Responsive Design for mobile devices */}
      <div className="md:hidden main-color p-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{getActiveMenuLabel()}</h2>
          {/* Dropdown button to toggle menu */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded"
          >
            <span className="text-sm">Menu</span>
            <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="mt-4 bg-white/10 rounded-lg p-4">
            <div className="space-y-2">
              {userMenuItems.map((item) => {
                const IconComponent = iconMap[item.icon as keyof typeof iconMap] || FiSettings;
                return (
                  <button
                    key={item.id}
                    className={`w-full text-left px-3 py-2 rounded flex items-center ${
                      activeMenuItem === item.id
                      ? 'bg-white/20 font-semibold'
                      : 'hover:bg-white/10'
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <IconComponent className="mr-3" size={18} />
                    {item.label}
                  </button>
                );
              })}
              
              {user?.role === 'admin' && adminMenuItems.length > 0 && (
                <>
                  <div className="border-t border-white/20 my-2 pt-2">
                    <p className="text-xs text-white/70 mb-2 px-3">ADMIN</p>
                  </div>
                  {adminMenuItems.map((item) => {
                    const IconComponent = iconMap[item.icon as keyof typeof iconMap] || FiSettings;
                    return (
                      <button
                        key={item.id}
                        className={`w-full text-left px-3 py-2 rounded flex items-center ${
                          activeMenuItem === item.id
                          ? 'bg-white/20 font-semibold'
                          : 'hover:bg-white/10'
                        }`}
                        onClick={() => handleMenuClick(item.id)}
                      >
                        <IconComponent className="mr-3" size={18} />
                        {item.label}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileMenu;