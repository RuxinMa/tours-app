import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../store/slices/authSlice';

import logo from '../../assets/logo-white.png';
import defaultImg from '../../assets/default.jpg';
import Modal from '../common/Modal';
import Button from '../common/Button';

const Navigation = () => {
  /* State Management */
  // 1️⃣ Local state for modal visibility
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 2️⃣ Redux state
  const { 
    user,  // User object
    isLoading,  // Loading state
    isAuthenticated  // Authentication status
  } = useAppSelector((state) => state.auth);

  // 3️⃣ Dispatch function
  const dispatch = useAppDispatch(); 

  // const isAuthenticated = true;  // ❇️ for testing
  const userName = user?.name || 'Guest';

  /* Handlers */
  const navigate = useNavigate(); // Navigation hook

  const handleGoToProfile = () => {
    navigate('/me');
  };

  const handleConfirmLogout = () => {
    dispatch(logoutUser()); // Dispatch logout action
    setShowLogoutModal(false); // Close modal after logout
  };

  const handleGoHome = () => {
    navigate('/');
  };


  return (
    <div className="navigation-container">
      <nav className="navigation">
        <div className="left-section">
          <button onClick={handleGoHome} className="header-button">
            ALL TOURS
          </button>
          <img src={logo} alt="Logo" className="logo-small" />
        </div>

        <div className="right-section">
          {isAuthenticated ? (
            <>
              {/* User Logout */}
              <button onClick={() => setShowLogoutModal(true)} className="header-button">
                LOG OUT
              </button>
              {/* User Info */}
              <button onClick={() => handleGoToProfile()} className="profile-button">
                <img src={user?.photo || defaultImg} alt="Profile" className="avatar" />
                <span>{userName}</span>
              </button>
            </>
           ):(
            <>
              <Link to="/login" className='header-button'>LOG IN</Link>
              <Link to="/register" className='header-button'>SIGN UP</Link>
            </>
           )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <p className='text-center m-4'>Are you sure you want to logout?</p>
        <div className="flex items-center justify-around mt-4">
          <Button
            variant="danger"
            size="sm"
            className="modal-btn"
            onClick={handleConfirmLogout} // Confirm logout
            loading={isLoading}
            disabled={isLoading} // Disable button while loading
            fullWidth={false}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="modal-btn"
            onClick={() => setShowLogoutModal(false)} // Close modal
            disabled={isLoading} // Disable button while loading
            fullWidth={false}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Navigation;
