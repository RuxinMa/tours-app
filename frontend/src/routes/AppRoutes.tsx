import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectRoute from '../components/auth/ProtectRoute';

const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const TourDetailPage = lazy(() => import('../pages/TourDetailPage'));
const BookingSuccessPage = lazy(() => import('../pages/BookingSuccessPage'));
const ErrorPage = lazy(() => import('../pages/ErrorPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        }/>
        <Route path='/register' element={
          <Suspense fallback={<div>Loading...</div>}>
            <RegisterPage />
          </Suspense>
        }/>

        <Route path='/' element={
          <Suspense fallback={<div>Loading...</div>}>
            <HomePage />
          </Suspense>
        }/>

        <Route path='/tour/:slug' element={
          <Suspense fallback={<div>Loading...</div>}>
            <TourDetailPage />
          </Suspense>
        }/>
        <Route path='/booking-success' element={
          <Suspense fallback={<div>Loading...</div>}>
            <BookingSuccessPage />
          </Suspense>
        }/>

        {/* Protected routes */}
        <Route path='/me' element={
          <ProtectRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <ProfilePage />
            </Suspense>
          </ProtectRoute>
        }/>

        {/* Catch-all route for 404 errors */}
        <Route path='*' element={
          <Suspense fallback={<div>Loading...</div>}>
            <ErrorPage />
          </Suspense>
        }/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;