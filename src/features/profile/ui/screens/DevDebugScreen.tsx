import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '@/shared/lib/supabaseClient';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import { useProfileStore } from '@/features/profile/data/store/profile.store';
import type { ConnectionStatus } from '@/shared/types';

export default function DevDebugScreen({ navigation }: { navigation: any }) {
  const connectionStatus = useProfileStore((s) => s.connectionStatus);
  const debugError = useProfileStore((s) => s.debugError);
  const debugDetails = useProfileStore((s) => s.debugDetails);
  const setConnectionStatus = useProfileStore((s) => s.setConnectionStatus);
  const setDebugError = useProfileStore((s) => s.setDebugError);
  const setDebugDetails = useProfileStore((s) => s.setDebugDetails);

  const testConnection = async () => {
    setConnectionStatus('testing');
    setDebugError(null);
    setDebugDetails('');

    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (error) {
        console.error('Supabase error:', error);
        setDebugError(error.message);
        setConnectionStatus('error');
        setDebugDetails(`Code: ${error.code}\nHint: ${error.hint || 'None'}`);
      } else {
        setConnectionStatus('ok');
        setDebugDetails(`Profiles count: ${count ?? 0}`);
      }
    } catch (e: any) {
      console.error('Connection error:', e);
      setDebugError(e.message);
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = (s: ConnectionStatus): string => {
    switch (s) {
      case 'ok':
        return colors.success;
      case 'error':
        return colors.primary;
      case 'testing':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <Screen padding={0}>
      <View style={styles.content}>
        <AppText variant="h2" style={{ textAlign: 'center', marginBottom: spacing[4] * 2 }}>
          Supabase Connection Test
        </AppText>

        <View style={[styles.statusCard, { borderColor: getStatusColor(connectionStatus) }]}>
          <AppText
            variant="captionSm"
            color={colors.textSecondary}
            style={{ marginBottom: spacing[2] }}
          >
            Status
          </AppText>
          <AppText variant="h2" color={getStatusColor(connectionStatus)}>
            {connectionStatus.toUpperCase()}
          </AppText>
        </View>

        {debugError && (
          <View style={styles.errorCard}>
            <AppText
              variant="captionSm"
              color={colors.primary}
              style={{ marginBottom: spacing[2] }}
            >
              Error
            </AppText>
            <AppText variant="body2" color={colors.primary}>
              {debugError}
            </AppText>
          </View>
        )}

        {debugDetails && (
          <View style={styles.detailsCard}>
            <AppText
              variant="captionSm"
              color={colors.textSecondary}
              style={{ marginBottom: spacing[2] }}
            >
              Details
            </AppText>
            <AppText variant="body2">{debugDetails}</AppText>
          </View>
        )}

        <TouchableOpacity
          style={styles.retryButton}
          onPress={testConnection}
          disabled={connectionStatus === 'testing'}
        >
          <AppText variant="buttonMd" color={colors.white}>
            {connectionStatus === 'testing' ? 'Testing...' : 'Retry Connection'}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AppText variant="body2">Back to App</AppText>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <AppText
            variant="captionSm"
            color={colors.textSecondary}
            style={{ marginBottom: spacing[2] }}
          >
            Environment
          </AppText>
          <AppText variant="captionSm" style={{ marginBottom: 4 }}>
            URL: {process.env.EXPO_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}
          </AppText>
          <AppText variant="captionSm" style={{ marginBottom: 4 }}>
            Key: {process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing[4],
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 2,
    padding: spacing[4],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  errorCard: {
    backgroundColor: colors.primaryTint,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing[4],
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  backButton: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
  },
});
