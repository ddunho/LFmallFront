// hooks/useModalState.js
import { useState } from 'react';

export const useModalState = () => {
  const [modals, setModals] = useState({
    alert: { 
      isOpen: false, 
      message: '' 
    },
    cart: { 
      isOpen: false, 
      message: '' 
    }
  });
  
  const openModal = (type, message = '') => {
    setModals(prev => ({
      ...prev,
      [type]: { 
        isOpen: true, 
        message 
      }
    }));
  };
  
  const closeModal = (type) => {
    setModals(prev => ({
      ...prev,
      [type]: { 
        isOpen: false, 
        message: '' 
      }
    }));
  };
  
  const closeAllModals = () => {
    setModals({
      alert: { isOpen: false, message: '' },
      cart: { isOpen: false, message: '' }
    });
  };
  
  return { 
    modals, 
    openModal, 
    closeModal, 
    closeAllModals 
  };
};