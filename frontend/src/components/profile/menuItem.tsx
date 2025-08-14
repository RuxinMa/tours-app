export interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

export const userMenuItems: MenuItem[] = [
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'bookings', label: 'My Bookings', icon: 'calendar' },
  { id: 'reviews', label: 'My Reviews', icon: 'star' },
  { id: 'billing', label: 'Billing', icon: 'card' }
];

export const adminMenuItems: MenuItem[] = [
  { id: 'admin-tours', label: 'Manage Tours', icon: 'map' },
  { id: 'admin-users', label: 'Manage Users', icon: 'users' },
  { id: 'admin-reviews', label: 'Manage Reviews', icon: 'star' },
  { id: 'admin-bookings', label: 'Manage Bookings', icon: 'calendar' },
];

export const getBookingStatusText = (status: string) => {
    switch (status) {
      case 'planned': return 'Planned';
      case 'pending-review': return 'Add Review';
      case 'reviewed': return 'Reviewed';
      default: return status;
    }
  };

export const getBookingStatusStyle = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 hover:border-blue-300 focus:ring-blue-500';
      case 'pending-review': return 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 hover:border-emerald-300 focus:ring-emerald-500';
      case 'reviewed': return 'bg-gray-50 hover:bg-gray-200 border border-gray-300 text-zinc-400 focus:ring-gray-500';
      default: return 'bg-gray-500';
    }
  };