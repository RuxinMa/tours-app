import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TourDetailPage from '../pages/TourDetailPage';
import ProfilePage from '../pages/ProfilePage';
import ErrorPage from '../pages/ErrorPage';
import ProtectRoute from '../components/auth/ProtectRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/' element={<HomePage />}/>
        <Route path='/tour/:slug' element={<TourDetailPage />} />

        {/* Protected routes */}
        <Route path='/me' element={
          <ProtectRoute>
            <ProfilePage />
          </ProtectRoute>
        }/>

        {/* Catch-all route for 404 errors */}
        <Route path='*' element={<ErrorPage />}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;