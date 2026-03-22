import { create } from 'zustand';
import type { ConnectionStatus } from '@/shared/types';

interface ProfileStore {
  displayName: string;
  isEditing: boolean;
  connectionStatus: ConnectionStatus;
  debugError: string | null;
  debugDetails: string;
  setDisplayName: (v: string) => void;
  setIsEditing: (v: boolean) => void;
  setConnectionStatus: (v: ConnectionStatus) => void;
  setDebugError: (v: string | null) => void;
  setDebugDetails: (v: string) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  displayName: '',
  isEditing: false,
  connectionStatus: 'idle',
  debugError: null,
  debugDetails: '',
  setDisplayName: (displayName) => set({ displayName }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setDebugError: (debugError) => set({ debugError }),
  setDebugDetails: (debugDetails) => set({ debugDetails }),
}));
