import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import { deriveTeamsFromTitle } from '@/shared/utils';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useBattleDetail } from '@/features/battles/ui/hooks';
import { BattleInfoCard } from '@/features/battles/ui/components/BattleInfoCard';
import { ScoreDisplay } from '@/features/battles/ui/components/ScoreDisplay';
import { WinnerCard } from '@/features/battles/ui/components/WinnerCard';
import { ParticipantsList } from '@/features/battles/ui/components/ParticipantsList';
import { JoinBattleSection } from '@/features/battles/ui/components/JoinBattleSection';
import type { BattleDetailScreenProps } from '@/shared/types';

export default function BattleDetailScreen({ navigation, route }: BattleDetailScreenProps) {
  const { user } = useAuth();
  const battleId = route.params?.battleId;

  const {
    battle,
    participants,
    gameScore,
    isLoading: detailLoading,
    pick,
    setPick,
    joinBattle,
    joining,
  } = useBattleDetail(battleId);

  const alreadyJoined = participants.some((p) => p.user_id === user?.id);
  const isCreator = battle?.creator_id === user?.id;
  const canJoin = battle?.status === 'open' && !alreadyJoined && !isCreator;

  const { home: derivedHomeTeam, away: derivedAwayTeam } = deriveTeamsFromTitle(battle?.title);
  const homeTeamName = gameScore?.strHomeTeam || derivedHomeTeam;
  const awayTeamName = gameScore?.strAwayTeam || derivedAwayTeam;

  const creatorParticipant = participants.find((p) => p.user_id === battle?.creator_id);
  const creatorWinningTeam = creatorParticipant?.pick;

  const isHeadToHeadBattle = !!creatorParticipant && !!homeTeamName && !!awayTeamName;

  const getJoinerWinningTeam = () => {
    if (!homeTeamName || !awayTeamName || !creatorWinningTeam) return null;
    if (creatorWinningTeam === homeTeamName) return awayTeamName;
    if (creatorWinningTeam === awayTeamName) return homeTeamName;
    return null;
  };

  const joinerWinningTeam = getJoinerWinningTeam();
  const isHeadToHeadReady = isHeadToHeadBattle && !!joinerWinningTeam;

  useEffect(() => {
    if (canJoin && joinerWinningTeam) {
      setPick(joinerWinningTeam);
    }
  }, [canJoin, joinerWinningTeam, setPick]);

  const handleJoin = async () => {
    let effectivePick = pick.trim();

    if (isHeadToHeadReady && joinerWinningTeam) {
      effectivePick = joinerWinningTeam;
    }

    if (!effectivePick) {
      Alert.alert('Pick required', 'Please select a team to join this battle');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to join a battle');
      return;
    }

    const { error } = await joinBattle({
      battleId: battleId!,
      userId: user.id,
      pick: effectivePick,
    });

    if (error) {
      Alert.alert('Join failed', error.message);
      return;
    }

    setPick('');
    Alert.alert('Joined!', 'You have successfully joined this battle.');
  };

  const matchEnded =
    gameScore && gameScore.intHomeScore !== null && gameScore.intAwayScore !== null;
  const pendingResolution = battle?.status === 'active' && matchEnded;

  const getWinnerName = (winnerId: string | null) => {
    if (!winnerId) return 'No winner';
    const winner = participants.find((p) => p.user_id === winnerId);
    if (winner?.user_id === user?.id) return 'You';
    return `Player (${winnerId.slice(0, 8)}...)`;
  };

  if (detailLoading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!battle) {
    return (
      <Screen>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <AppText variant="h4">Battle Not Found</AppText>
          <View style={styles.placeholder} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <AppText variant="h4">Battle Details</AppText>
          <View style={styles.placeholder} />
        </View>

        <BattleInfoCard battle={battle} isCreator={!!isCreator} />

        {gameScore && (
          <ScoreDisplay gameScore={gameScore} isCompleted={battle.status === 'completed'} />
        )}

        <WinnerCard
          battle={battle}
          winnerName={getWinnerName(battle.winner_id)}
          pendingResolution={!!pendingResolution}
        />

        <ParticipantsList participants={participants} currentUserId={user?.id} />

        <JoinBattleSection
          canJoin={!!canJoin}
          alreadyJoined={alreadyJoined}
          isCreator={!!isCreator}
          isHeadToHeadBattle={isHeadToHeadBattle}
          isHeadToHeadReady={isHeadToHeadReady}
          creatorWinningTeam={creatorWinningTeam}
          joinerWinningTeam={joinerWinningTeam}
          homeTeamName={homeTeamName ?? ''}
          awayTeamName={awayTeamName ?? ''}
          pick={pick}
          onPickChange={setPick}
          joining={joining}
          onJoin={handleJoin}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
});
