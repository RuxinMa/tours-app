import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAuth } from './hooks/useAuth';
import AppRoutes from './routes/AppRoutes';


const AppContent = () => {
  // 1）Get authentication state from the custom hook
  const { initializeAuth, isInitialized } = useAuth();

  // 2） Check if the auth state is initialized
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 3）If not initialized, show a loading state or empty div
  if (!isInitialized) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  return (
    <div>
      <AppRoutes />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;