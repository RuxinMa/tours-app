import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { initializeAuth } from './store/slices/authSlice';
import AppRoutes from './routes/AppRoutes';


const AppContent = () => {
  // 1）Dispatch to initialize auth state
  const dispatch = useAppDispatch(); 

  // 2）Check if auth state is initialized
  const { isInitialized } = useAppSelector(state => state.auth);

  // 3）Initialize authentication status when the application starts
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // 4）If not initialized, show a loading state or empty div
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