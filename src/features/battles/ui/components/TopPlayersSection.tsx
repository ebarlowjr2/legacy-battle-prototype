import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { TOP_PLAYERS } from '@/shared/constants';

export function TopPlayersSection() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <AppText variant="h4" style={{ marginBottom: spacing[2] }}>Top Players</AppText>
        <TouchableOpacity style={styles.seeAllButton}>
          <AppText variant="captionSm" color={colors.textSecondary}>See All</AppText>
          <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {TOP_PLAYERS.map((player, index) => (
          <View key={player.name} style={styles.topPlayerCard}>
            <View style={styles.topPlayerAvatar}>
              <AppText variant="h4" color={colors.white}>{index + 1}</AppText>
            </View>
            <AppText variant="label">{player.name}</AppText>
            <AppText variant="captionSm" color={colors.textSecondary}>
              {player.xp} XP
            </AppText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing[4] * 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topPlayerCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    alignItems: 'center',
    marginRight: spacing[2],
    minWidth: 100,
  },
  topPlayerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
});
