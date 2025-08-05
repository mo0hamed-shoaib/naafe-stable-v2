import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ResetPasswordModal } from './ResetPasswordModal';

export const ResetPasswordHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setShowModal(true);
    } else {
      // If no token, redirect to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleClose = () => {
    setShowModal(false);
    // Redirect to login after closing the modal
    navigate('/login', { replace: true });
  };

  if (!token) {
    return null;
  }

  return (
    <ResetPasswordModal
      isOpen={showModal}
      onClose={handleClose}
      token={token}
    />
  );
}; 