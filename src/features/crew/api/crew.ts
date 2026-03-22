import { supabase } from '@/shared/lib/supabaseClient';
import { callEdgeFunction } from '@/shared/lib/edgeFunctions';
import type { CrewRequest } from '@/shared/types';

export const CrewService = {
  sendRequest: async (username: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return { data: null, error: { message: 'Not authenticated' } };

    const result = await callEdgeFunction<{
      request?: CrewRequest;
      error?: string;
      existingStatus?: string;
    }>('crew-request', { username });

    if (result.error) {
      return { data: null, error: { message: result.error.message || 'Failed to send request' } };
    }

    if (result.data?.error) {
      return {
        data: null,
        error: {
          message: result.data.error,
          code: result.data.existingStatus === 'pending' ? '23505' : undefined,
        },
      };
    }

    return { data: result.data?.request ?? null, error: null };
  },

  sendRequestById: async (receiverId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return { data: null, error: { message: 'Not authenticated' } };

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', receiverId)
      .single();

    if (!profile?.username) {
      return { data: null, error: { message: 'Could not find user' } };
    }

    return CrewService.sendRequest(profile.username);
  },

  respondToRequest: async (requestId: string, action: 'accept' | 'decline' | 'cancel') => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return { data: null, error: { message: 'Not authenticated' } };

    const result = await callEdgeFunction<{ error?: string }>('crew-respond', {
      request_id: requestId,
      action,
    });

    if (result.error) {
      return { data: null, error: { message: result.error.message || 'Failed to respond' } };
    }

    if (result.data?.error) {
      return { data: null, error: { message: result.data.error } };
    }

    return { data: result.data ?? null, error: null };
  },

  acceptRequest: async (requestId: string) => {
    return CrewService.respondToRequest(requestId, 'accept');
  },

  declineRequest: async (requestId: string) => {
    return CrewService.respondToRequest(requestId, 'decline');
  },

  cancelRequest: async (requestId: string) => {
    return CrewService.respondToRequest(requestId, 'cancel');
  },
};
