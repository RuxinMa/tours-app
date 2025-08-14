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