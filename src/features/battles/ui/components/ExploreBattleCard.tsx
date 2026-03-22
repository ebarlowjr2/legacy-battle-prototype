import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import type { ExploreBattleCardProps } from '@/shared/types';

export function ExploreBattleCard({ battle, activeTab }: ExploreBattleCardProps) {
  return (
    <View style={styles.battleCard}>
      <View style={styles.battleTags}>
        <View
          style={[
            styles.tag,
            activeTab === 'Trending' && styles.tagRed,
            activeTab === 'Ending Soon' && styles.tagRed,
            activeTab === 'New' && styles.tagGreen,
            activeTab === 'High Activity' && styles.tagBlue,
          ]}
        >
          <AppText variant="captionSm" color={colors.white} style={{ fontSize: 10 }}>
            {activeTab === 'Trending' ? 'Ongoing' : activeTab}
          </AppText>
        </View>
        <View style={styles.tagOutline}>
          <Ionicons name="football-outline" size={12} color={colors.textSecondary} />
          <AppText variant="captionSm" color={colors.textSecondary} style={{ fontSize: 10 }}>
            Game Pick
          </AppText>
        </View>
        <View style={styles.entryFee}>
          <AppText variant="captionSm" style={{ fontSize: 12 }}>🪙</AppText>
          <AppText variant="captionSm" color={colors.textSecondary} style={{ fontSize: 10 }}>
            {battle.stake || 50} Bc Entry
          </AppText>
        </View>
      </View>

      <AppText variant="buttonMd" style={{ marginBottom: spacing[2] }}>
        {battle.title || 'Super Bowl QB Passing Yards Duel'}
      </AppText>

      <View style={styles.battlePlayers}>
        <View style={styles.playerBadge}>
          <AppText variant="captionSm" style={{ fontSize: 12 }}>🏈</AppText>
        </View>
        <AppText variant="captionSm">Mahomes</AppText>
        <AppText variant="captionSm" color={colors.textSecondary}>Vs</AppText>
        <View style={styles.playerBadge}>
          <AppText variant="captionSm" style={{ fontSize: 12 }}>🏈</AppText>
        </View>
        <AppText variant="captionSm">Burrow</AppText>
      </View>

      <View style={styles.battleFooter}>
        <View style={styles.battleInfo}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <AppText variant="captionSm" color={colors.textSecondary}>
            Created {new Date(battle.created_at).toLocaleDateString()}
          </AppText>
        </View>
        {activeTab === 'Trending' && (
          <View style={styles.battleInfo}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
            <AppText variant="captionSm" color={colors.textSecondary}>
              {battle.participant_count || 247} Joined
            </AppText>
          </View>
        )}
        <TouchableOpacity style={styles.joinButton}>
          <AppText variant="buttonMd" color={colors.white}>Join</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  battleCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  battleTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  tagRed: {
    backgroundColor: colors.primary,
  },
  tagGreen: {
    backgroundColor: colors.success,
  },
  tagBlue: {
    backgroundColor: colors.info,
  },
  tagOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  entryFee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  battlePlayers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  playerBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  battleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    marginLeft: 'auto',
  },
});
