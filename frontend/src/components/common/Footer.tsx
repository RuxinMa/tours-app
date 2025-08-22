import { FiGithub, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Main Footer Content */}
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Brand Section */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Tours App</h3>
              <p className="text-sm text-gray-400 max-w-md">
                Discover amazing destinations and create unforgettable memories with our curated tour experiences.
              </p>
            </div>

            {/* GitHub & Social Links */}
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <div className="flex justify-center md:justify-end space-x-4 mb-3">
                <a
                  href="https://github.com/RuxinMa/tours-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <FiGithub className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm">View Source</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>© 2025 Tours App. All rights reserved.</span>
            </div>

            {/* Made with Love */}
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Crafted by</span>
              <a
                href="https://www.linkedin.com/in/ruxin-ma/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                @RuxinMa
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;