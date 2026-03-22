import { useContext } from 'react';
import { ToastContext } from './ToastProvider';

export function useToast(): { showToast: (type: 'success' | 'fail', message: string) => void } {
  const ctx = useContext(ToastContext);
  if (ctx === undefined) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
