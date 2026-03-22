import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, LoadingState, ErrorState } from '@/shared/ui';
import { spacing } from '@/shared/theme';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useAppTheme } from '@/app/providers';
import type { AppStackParamList, TabParamList } from '@/app/navigation/types';
import { getLevelInfo } from '@/features/profile/helpers/level';
import { useProfile } from '@/features/profile/ui/hooks/useProfile';
import { ProfileHeader } from '@/features/profile/ui/components/ProfileHeader';
import { StatsGrid } from '@/features/profile/ui/components/StatsGrid';
import { LevelCard } from '@/features/profile/ui/components/LevelCard';
import { WalletCard } from '@/features/profile/ui/components/WalletCard';
import { ProfileMenu } from '@/features/profile/ui/components/ProfileMenu';

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { signOut, user } = useAuth();
  const { mode, toggleTheme } = useAppTheme();

  const {
    profile,
    profileLoading,
    profileError,
    displayName,
    setDisplayName,
    saving,
    isEditing,
    setIsEditing,
    battleStats,
    crewCount,
    pendingCrewCount,
    saveProfile,
    refetch,
  } = useProfile(user?.id);

  const handleSaveProfile = async () => {
    const { error } = await saveProfile();
    if (error) {
      Alert.alert('Update Failed', error.message);
    } else {
      Alert.alert('Updated', 'Your profile was updated.');
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const walletBalance = Number(profile?.wallet_balance || 0).toFixed(2);
  const xpValue = profile?.xp || 0;
  const levelInfo = getLevelInfo(xpValue);

  if (profileLoading) {
    return (
      <Screen>
        <LoadingState message="Loading profile..." />
      </Screen>
    );
  }

  // if (profileError) {
  //   return (
  //     <Screen>
  //       <ErrorState message={profileError} onRetry={handleRetry} />
  //     </Screen>
  //   );
  // }

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProfileHeader
          displayName={profile?.display_name ?? undefined}
          username={profile?.username ?? undefined}
          email={user?.email ?? undefined}
          xp={xpValue}
        />

        <StatsGrid battleStats={battleStats} walletBalance={walletBalance} />

        <LevelCard levelInfo={levelInfo} xp={xpValue} />

        <WalletCard walletBalance={walletBalance} />

        <ProfileMenu
          crewCount={crewCount}
          pendingCrewCount={pendingCrewCount}
          themeMode={mode}
          onToggleTheme={toggleTheme}
          onCrewPress={() => navigation.navigate('Friends')}
          onLogout={handleLogout}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
});
