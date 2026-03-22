import React, { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/data/store/auth.store';

/**
 * Marks auth as ready after first paint. Session tokens come from persisted Zustand (API auth).
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return <>{children}</>;
};
