import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import AuthForm from './AuthForm';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onSuccess }) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-400 hover:text-neonOrange transition-colors"
          aria-label="close auth modal"
        >
          ✕
        </button>
        <AuthForm
          mode="modal"
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
