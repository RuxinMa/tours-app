import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode; // Modal content
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlayClick?: boolean; // clicking outside the modal closes it
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
}: ModalProps) => {

  // Stop body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300" />
      
      {/* Modal  */}
      <div 
        className={`
          relative bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden
          transform transition-all duration-300 w-full
          ${sizeClasses[size]}
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Modal header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 
              id="modal-title" 
              className="text-xl font-semibold text-gray-900"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Modal content */}
        <div className={`${title ? 'p-6' : 'p-8'} max-h-[calc(90vh-8rem)] overflow-y-auto md:text-xl my-2`}>
          {children}
        </div>
      </div>
    </div>
  );

  // 🔑 Use createPortal to render the modal into the body
  return createPortal(modalContent, document.body);
};

export default Modal;