import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { queryClient } from '@/shared/lib/queryClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserData } from '@/shared/types';

interface AuthStore {
  isLoading: boolean;
  isAuthenticated: boolean;
  /** True after OTP until username is chosen (Auth stack still shown while tokens exist). */
  needsUsername: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  /** Last registered Expo push token (for DELETE /devices/{token} on logout). */
  expoPushToken: string | null;
  user: UserData | null;
  setLoading: (loading: boolean) => void;
  setExpoPushToken: (token: string | null) => void;
  setAuthTokens: (accessToken: string, refreshToken: string) => void;
  setNeedsUsername: (needs: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: UserData | null) => void;
  setHasHydrated: (state: boolean) => void;
  _hasHydrated: boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoading: true,
      isAuthenticated: false,
      needsUsername: false,
      accessToken: null,
      refreshToken: null,
      expoPushToken: null,
      user: null,
      _hasHydrated: false,
      setLoading: (loading) => set({ isLoading: loading }),
      setAuthTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),
      setNeedsUsername: (needsUsername) => set({ needsUsername }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setUser: (user) => set({ user }),
      setExpoPushToken: (expoPushToken) => set({ expoPushToken }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      logout: () =>
        set(() => {
          queryClient.clear();
          return {
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            needsUsername: false,
            expoPushToken: null,
            user: null,
          };
        }),
    }),
    {
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      name: 'authStore',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        needsUsername: state.needsUsername,
        expoPushToken: state.expoPushToken,
        user: state.user,
      }),
    },
  ),
);
