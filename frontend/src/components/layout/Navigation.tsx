import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserImageUrl } from '../../services/utils/imageUtils';

import logo from '../../assets/logo-white.png';
import Modal from '../common/Modal';
import Button from '../common/Button';

const Navigation = () => {
  /* State Management */
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth(); // Use custom hook for auth state

  // const isAuthenticated = true;  // ❇️ for testing
  const userName = user?.name || 'Guest';

  /* Handlers */
  const navigate = useNavigate(); // Navigation hook

  const handleGoToProfile = () => {
    navigate('/me');
  };

  const handleConfirmLogout = () => {
    logout(); // Call logout function from custom hook
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
                <img src={getUserImageUrl(user?.photo || '/img/users/default.jpg')} alt="Profile" className="avatar" />
                <span>{userName.split(' ')[0]}</span>
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
        <div className="flex justify-between w-full mt-6 space-x-16 px-4">
          <Button
            variant="secondary"
            size="md"
            className="modal-btn"
            onClick={() => setShowLogoutModal(false)} // Close modal
            disabled={isLoading} // Disable button while loading
            fullWidth={true}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            className="modal-btn"
            onClick={handleConfirmLogout} // Confirm logout
            loading={isLoading}
            disabled={isLoading} // Disable button while loading
            fullWidth={true}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Navigation;
