export type UserRoles = 'admin' | 'user' | 'guest' | 'lead-guide';

export interface User {
    id: string;
    name: string;
    email: string;
    photo: string | null;
    role: UserRoles; // Union type for roles
} 

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

