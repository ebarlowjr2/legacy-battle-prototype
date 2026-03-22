import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen, Avatar } from '@/shared/ui';
import { getInitials } from '@/shared/utils';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useCrew } from '../hooks/useCrew';
import {
  useAcceptRequest,
  useDeclineRequest,
  useSendRequestById,
} from '@/features/crew/data/mutations/useCrewMutations';
import type { FriendsScreenProps } from '@/shared/types';

export default function FriendsScreen({ navigation }: FriendsScreenProps) {
  const { user } = useAuth();
  const {
    crewMembers,
    pendingReceived,
    suggestions,
    friendsLoading,
    friendsRefreshing,
    refetch,
  } = useCrew(user?.id);

  const acceptMutation = useAcceptRequest(user?.id);
  const declineMutation = useDeclineRequest(user?.id);
  const sendRequestMutation = useSendRequestById(user?.id);

  const onRefresh = () => {
    refetch();
  };

  const handleAccept = async (requestId: string) => {
    const { error } = await acceptMutation.mutateAsync(requestId);
    if (error) {
      Alert.alert('Error', 'Failed to accept request');
    }
  };

  const handleReject = async (requestId: string) => {
    const { error } = await declineMutation.mutateAsync(requestId);
    if (error) {
      Alert.alert('Error', 'Failed to reject request');
    }
  };

  const handleAddSuggestion = async (memberId: string) => {
    const { error } = await sendRequestMutation.mutateAsync(memberId);
    if (error) {
      if ('code' in error && error.code === '23505') {
        Alert.alert('Already Sent', 'You already have a pending request with this user.');
      } else {
        Alert.alert('Error', error.message || 'Failed to send request');
      }
    } else {
      Alert.alert('Sent', 'Crew request sent!');
    }
  };

  if (friendsLoading) {
    return (
      <Screen padding={0}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen padding={0}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <AppText variant="h4">Crew</AppText>
          <Ionicons name="people-outline" size={18} color={colors.primary} />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddFriend')}>
          <Ionicons name="person-add-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={friendsRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {pendingReceived.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.pendingIndicator} />
              <AppText variant="h6">Pending Requests ({pendingReceived.length})</AppText>
            </View>
            {pendingReceived.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <Avatar
                  initials={getInitials(
                    request.sender?.display_name ?? null,
                    request.sender?.username ?? null,
                  )}
                  size="md"
                  backgroundColor={colors.primary}
                  borderColor={colors.primary}
                  textColor={colors.white}
                />
                <View style={styles.requestInfo}>
                  <AppText variant="label">
                    {request.sender?.display_name || request.sender?.username || 'Unknown'}
                  </AppText>
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    @{request.sender?.username || 'user'}
                  </AppText>
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAccept(request.id)}
                >
                  <Ionicons name="checkmark" size={18} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleReject(request.id)}
                >
                  <Ionicons name="close" size={18} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={16} color={colors.primary} />
            <AppText variant="h6">Crew ({crewMembers.length})</AppText>
          </View>
          {crewMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
              <AppText variant="h4" style={{ marginTop: spacing[4] }}>
                No crew members yet
              </AppText>
              <AppText
                variant="body2"
                color={colors.textSecondary}
                style={{ marginTop: spacing[2], marginBottom: spacing[4] }}
              >
                Add people to your crew to challenge them!
              </AppText>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => navigation.navigate('AddFriend')}
              >
                <Ionicons name="person-add-outline" size={18} color={colors.white} />
                <AppText variant="buttonMd" color={colors.white}>
                  Find People
                </AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.crewGrid}>
              {crewMembers.map((member) => (
                <TouchableOpacity key={member.id} style={styles.crewItem}>
                  <View style={styles.crewAvatarContainer}>
                    <Avatar
                      initials={getInitials(member.display_name, member.username)}
                      size="lg"
                      backgroundColor={colors.card}
                      borderColor={colors.primary}
                    />
                  </View>
                  <AppText
                    variant="captionSm"
                    style={{ textAlign: 'center' }}
                    numberOfLines={1}
                  >
                    {member.display_name || member.username}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {suggestions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash" size={16} color={colors.gold} />
              <AppText variant="h6">Suggested from Battles</AppText>
            </View>
            <AppText
              variant="captionSm"
              color={colors.textSecondary}
              style={{ marginBottom: spacing[4], marginTop: -spacing[2] }}
            >
              People you've battled with
            </AppText>
            {suggestions.map((member) => (
              <View key={member.id} style={styles.suggestionCard}>
                <Avatar
                  initials={getInitials(member.display_name, member.username)}
                  size="md"
                  backgroundColor={colors.primary}
                  borderColor={colors.primary}
                  textColor={colors.white}
                />
                <View style={styles.requestInfo}>
                  <AppText variant="label">
                    {member.display_name || member.username || 'Unknown'}
                  </AppText>
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    @{member.username || 'user'}
                  </AppText>
                </View>
                <TouchableOpacity
                  style={styles.addSuggestionButton}
                  onPress={() => handleAddSuggestion(member.id)}
                >
                  <Ionicons name="person-add" size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: spacing[4] * 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  pendingIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.warning,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  requestInfo: {
    flex: 1,
    marginLeft: spacing[4],
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
  crewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  crewItem: {
    alignItems: 'center',
    width: 80,
  },
  crewAvatarContainer: {
    marginBottom: spacing[2],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4] * 3,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4] * 1.5,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    gap: spacing[2],
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  addSuggestionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
});
