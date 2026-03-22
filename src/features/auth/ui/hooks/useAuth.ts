import { logoutSession } from '../../data/logoutSession';
import { useAuthStore } from '../../data/store/auth.store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.isLoading);

  return {
    user,
    loading,
    signOut: logoutSession,
  };
}
