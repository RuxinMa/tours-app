import type { User }  from '../../types/user';
import { 
  FiSettings, 
  FiCalendar, 
  FiStar, 
  FiCreditCard, 
  FiMap, 
  FiUsers 
} from "react-icons/fi";

const iconMap = {
  settings: FiSettings,
  calendar: FiCalendar,
  star: FiStar,
  card: FiCreditCard,
  map: FiMap,
  users: FiUsers,
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
  return (
      <div className="main-color p-4 shadow-sm text-white h-full flex flex-col">
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
  );
};

export default ProfileMenu;