import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen, Avatar, SearchInput } from '@/shared/ui';
import { getInitials } from '@/shared/utils';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useAddFriend } from '../hooks/useAddFriend';
import type { AddFriendScreenProps, CrewMemberWithStatus } from '@/shared/types';

export default function AddFriendScreen({ navigation }: AddFriendScreenProps) {
  const { user } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    hasSearched,
    handleSearch,
    handleAddFriend,
  } = useAddFriend(user?.id);

  const onAddFriend = async (friendId: string, friendName: string) => {
    const { error } = await handleAddFriend(friendId);
    if (error) {
      if ('code' in error && error.code === '23505') {
        Alert.alert('Already Sent', 'You already have a pending request with this user.');
      } else {
        Alert.alert('Error', error.message || 'Failed to send crew request');
      }
    } else {
      Alert.alert('Crew Request Sent', `A crew request has been sent to ${friendName}`);
    }
  };

  const handleInviteViaText = async () => {
    const message = `Hey! Join me on Legacy Battle - the ultimate sports prediction app! Download it here: [App Store Link]`;
    const url = `sms:&body=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Share.share({ message });
      }
    } catch (error) {
      console.error('Error opening SMS:', error);
      await Share.share({ message });
    }
  };

  const handleInviteViaEmail = async () => {
    const subject = 'Join me on Legacy Battle!';
    const body = `Hey!\n\nI've been using Legacy Battle to make sports predictions and challenge friends. You should join me!\n\nDownload the app here: [App Store Link]\n\nSee you on the battlefield!`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Email is not available on this device');
      }
    } catch (error) {
      console.error('Error opening email:', error);
      Alert.alert('Error', 'Could not open email app');
    }
  };

  return (
    <Screen padding={0}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>
        <AppText variant="h4">Add Crew</AppText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <AppText variant="h4" style={{ marginBottom: 4 }}>
            Search for Crew
          </AppText>
          <AppText variant="body2" color={colors.textSecondary} style={{ marginBottom: spacing[4] }}>
            Find people by username
          </AppText>

          <View style={styles.searchContainer}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Enter username"
              onSubmit={handleSearch}
              style={styles.searchInputWrapper}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <AppText variant="buttonMd" color={colors.white}>
                Search
              </AppText>
            </TouchableOpacity>
          </View>

          {searching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <AppText variant="body2" color={colors.textSecondary}>
                Searching...
              </AppText>
            </View>
          ) : hasSearched && searchResults.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="person-outline" size={32} color={colors.textSecondary} />
              <AppText variant="label" style={{ marginTop: spacing[2] }}>
                No users found
              </AppText>
              <AppText variant="captionSm" color={colors.textSecondary} style={{ marginTop: 4 }}>
                Try a different email or username
              </AppText>
            </View>
          ) : (
            searchResults.map((result: CrewMemberWithStatus) => (
              <View key={result.id} style={styles.resultItem}>
                <Avatar
                  initials={getInitials(result.display_name, result.username)}
                  size="md"
                  backgroundColor={colors.primary}
                  borderColor={colors.primary}
                  textColor={colors.white}
                />
                <View style={styles.resultInfo}>
                  <AppText variant="label">
                    {result.display_name || result.username || 'Unknown'}
                  </AppText>
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    @{result.username || 'no-username'}
                  </AppText>
                </View>
                {result.requestStatus === 'accepted' ? (
                  <View style={[styles.actionButton, styles.actionButtonDone]}>
                    <Ionicons name="checkmark" size={18} color={colors.white} />
                  </View>
                ) : result.requestStatus === 'pending' ? (
                  <View style={[styles.actionButton, styles.actionButtonPending]}>
                    <Ionicons name="time" size={18} color={colors.white} />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      onAddFriend(result.id, result.display_name || result.username || 'User')
                    }
                  >
                    <Ionicons name="person-add" size={18} color={colors.white} />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <AppText variant="captionSm" color={colors.textSecondary} style={{ paddingHorizontal: spacing[4] }}>
            OR
          </AppText>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.section}>
          <AppText variant="h4" style={{ marginBottom: 4 }}>
            Invite to Crew
          </AppText>
          <AppText variant="body2" color={colors.textSecondary} style={{ marginBottom: spacing[4] }}>
            Invite people who aren't on Legacy Battle yet
          </AppText>

          <TouchableOpacity style={styles.inviteOption} onPress={handleInviteViaText}>
            <View style={styles.inviteIconContainer}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.inviteTextContainer}>
              <AppText variant="label">Invite via Text Message</AppText>
              <AppText variant="captionSm" color={colors.textSecondary} style={{ marginTop: 2 }}>
                Send an SMS invitation to your contacts
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.inviteOption} onPress={handleInviteViaEmail}>
            <View style={styles.inviteIconContainer}>
              <Ionicons name="mail-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.inviteTextContainer}>
              <AppText variant="label">Invite via Email</AppText>
              <AppText variant="captionSm" color={colors.textSecondary} style={{ marginTop: 2 }}>
                Send an email invitation
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 36,
  },
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  searchContainer: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  searchInputWrapper: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4] * 2,
    gap: spacing[2],
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: spacing[4] * 2,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginTop: spacing[2],
  },
  resultInfo: {
    flex: 1,
    marginLeft: spacing[4],
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDone: {
    backgroundColor: colors.success,
  },
  actionButtonPending: {
    backgroundColor: colors.warning,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginVertical: spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inputBorder,
  },
  inviteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  inviteIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteTextContainer: {
    flex: 1,
    marginLeft: spacing[4],
  },
});
