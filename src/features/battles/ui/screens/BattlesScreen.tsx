import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, radii } from '@/shared/theme';
import {
  AppText,
  Screen,
  ScreenHeader,
  TabBar,
  StatusBadge,
  LoadingState,
  EmptyState,
  ErrorState,
} from '@/shared/ui';
import { getStatusColor, formatRelativeDate } from '@/shared/utils';
import { useBattles } from '@/features/battles/ui/hooks';
import type { AppStackParamList, TabParamList } from '@/app/navigation/types';
import type { TabType } from '@/shared/types';
import { BATTLES_LIST_TABS } from '@/shared/constants';

type BattlesScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Battles'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function BattlesScreen({ navigation }: BattlesScreenProps) {
  const {
    battles: filteredBattles,
    isLoading: listLoading,
    isRefreshing: listRefreshing,
    listActiveTab,
    error: listError,
    refetch,
    setListActiveTab,
  } = useBattles();

  const onRefresh = () => refetch();

  return (
    <Screen padding={0}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={listRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <ScreenHeader
          title="My Battles"
          rightSlot={
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateBattle')}
            >
              <Ionicons name="add" size={20} color={colors.white} />
              <AppText variant="buttonMd" color={colors.white}>
                Create
              </AppText>
            </TouchableOpacity>
          }
        />

        <TabBar
          tabs={BATTLES_LIST_TABS}
          activeTab={listActiveTab}
          onTabChange={(key) => setListActiveTab(key as TabType)}
        />

        {listLoading ? (
          <LoadingState message="Loading battles..." />
        ) : listError ? (
          <ErrorState message={listError?.message ?? 'Failed to load'} onRetry={() => refetch()} />
        ) : filteredBattles.length === 0 ? (
          <EmptyState
            title={`No ${listActiveTab} battles`}
            message="Create your first battle to get started."
          >
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('CreateBattle')}
            >
              <AppText variant="buttonMd" color={colors.white}>
                Create Your First Battle
              </AppText>
            </TouchableOpacity>
          </EmptyState>
        ) : (
          filteredBattles.map((battle) => (
            <View key={battle.id} style={styles.battleCard}>
              <View style={styles.battleHeader}>
                <View style={styles.battleLeft}>
                  <View style={styles.battleIcon}>
                    <AppText style={{ fontSize: 20 }}>⚔️</AppText>
                  </View>
                  <View>
                    <AppText variant="label" numberOfLines={1}>
                      {battle.title}
                    </AppText>
                    <AppText variant="captionSm" color={colors.textSecondary} numberOfLines={1}>
                      {battle.description || 'No description'}
                    </AppText>
                  </View>
                </View>
                <StatusBadge label={battle.status} color={getStatusColor(battle.status)} />
              </View>
              <View style={styles.battleDetails}>
                <View style={styles.stakeInfo}>
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    Stake:
                  </AppText>
                  <AppText variant="captionSm" style={{ fontWeight: 'bold' }}>
                    {battle.stake} BC
                  </AppText>
                </View>
                <View style={styles.timeInfo}>
                  <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    {formatRelativeDate(battle.created_at)}
                  </AppText>
                </View>
              </View>
              <View style={styles.battleFooter}>
                <View style={styles.battleTypeBadge}>
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    {battle.event_id ? 'Sports Event' : 'Custom Battle'}
                  </AppText>
                </View>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => navigation.navigate('BattleDetail', { battleId: battle.id })}
                >
                  <AppText variant="buttonMd" color={colors.white}>
                    View
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    gap: 4,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
  },
  battleCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  battleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  battleIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  stakeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  battleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  battleTypeBadge: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
  },
});
