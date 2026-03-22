import { Toast } from '@/shared/ui';
import React, { createContext, useState, ReactNode } from 'react';
import type { ToastContextProps } from '@/shared/types';

export const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    visible: boolean;
    type: 'success' | 'fail';
    message: string;
  }>({
    visible: false,
    type: 'success',
    message: '',
  });

  const showToast = (type: 'success' | 'fail', message: string) => {
    setToast({ visible: true, type, message });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};
