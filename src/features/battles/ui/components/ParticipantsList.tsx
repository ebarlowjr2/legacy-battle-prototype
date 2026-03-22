import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatFullDate } from '@/shared/utils';
import type { ParticipantsListProps } from '@/shared/types';

export function ParticipantsList({ participants, currentUserId }: ParticipantsListProps) {
  return (
    <View style={styles.section}>
      <AppText variant="buttonMd" style={styles.sectionTitle}>
        Participants ({participants.length})
      </AppText>

      {participants.length === 0 ? (
        <View style={styles.emptyParticipants}>
          <Ionicons name="people-outline" size={32} color={colors.textSecondary} />
          <AppText variant="body2" color={colors.textSecondary} style={styles.emptyText}>
            No participants yet
          </AppText>
          <AppText variant="captionSm" color={colors.textSecondary} style={styles.emptySubtext}>
            Be the first to join!
          </AppText>
        </View>
      ) : (
        <View style={styles.participantsList}>
          {participants.map((participant, index) => (
            <View key={participant.id} style={styles.participantCard}>
              <View style={styles.participantLeft}>
                <View style={styles.participantAvatar}>
                  <Ionicons name="person" size={20} color={colors.textSecondary} />
                </View>
                <View>
                  <AppText variant="label">
                    {participant.user_id === currentUserId ? 'You' : `Player ${index + 1}`}
                  </AppText>
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    Joined {formatFullDate(participant.joined_at)}
                  </AppText>
                </View>
              </View>
              <View style={styles.pickBadge}>
                <AppText variant="captionSm" color={colors.textSecondary}>Pick:</AppText>
                <AppText variant="captionSm">{participant.pick || '-'}</AppText>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[4],
  },
  emptyParticipants: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4] * 2,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: spacing[2],
  },
  emptySubtext: {
    marginTop: 4,
  },
  participantsList: {
    gap: spacing[2],
  },
  participantCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickBadge: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
