import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { BattleService, Battle, BattleParticipant } from '../services/battleService';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getResultByEventId, SportsEvent } from '../services/sportsApi';
import { AwardXpResult } from '../services/xpService';

interface BattleDetailScreenProps {
  navigation: any;
  route: any;
}

export default function BattleDetailScreen({ navigation, route }: BattleDetailScreenProps) {
  const { user } = useAuth();
  const battleId = route.params?.battleId;

  const [battle, setBattle] = useState<Battle | null>(null);
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [pick, setPick] = useState('');
  const [gameScore, setGameScore] = useState<SportsEvent | null>(null);
  const [resolving, setResolving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const loadBattle = async () => {
    if (!battleId) return;

    const { battle, participants, error } = await BattleService.getBattleWithParticipants(battleId);
    if (error) {
      console.error('Error loading battle', error);
    }
    setBattle(battle);
    setParticipants(participants);
    setLoading(false);
  };

  useEffect(() => {
    loadBattle();

    const battleChannel = BattleService.subscribeToBattles((payload) => {
      if (payload.new?.id === battleId || payload.old?.id === battleId) {
        loadBattle();
      }
    });

    const participantChannel = BattleService.subscribeToParticipants(battleId, () => {
      loadBattle();
    });

    return () => {
      supabase.removeChannel(battleChannel);
      supabase.removeChannel(participantChannel);
    };
  }, [battleId]);

  useEffect(() => {
    if (!battle?.event_id) return;

    const fetchScore = async () => {
      const { data } = await getResultByEventId(battle.event_id!);
      if (data) {
        setGameScore(data);
      }
    };

    fetchScore();

    const interval = setInterval(fetchScore, 60000);

    return () => clearInterval(interval);
  }, [battle?.event_id]);

  const alreadyJoined = participants.some((p) => p.user_id === user?.id);
  const isCreator = battle?.creator_id === user?.id;
  const canJoin = battle?.status === 'open' && !alreadyJoined && !isCreator;

  const deriveTeamsFromTitle = (titleStr: string | undefined) => {
    if (!titleStr) return { home: undefined, away: undefined };
    const parts = titleStr.split(' vs ');
    if (parts.length === 2) {
      return { home: parts[0].trim(), away: parts[1].trim() };
    }
    return { home: undefined, away: undefined };
  };

  const { home: derivedHomeTeam, away: derivedAwayTeam } = deriveTeamsFromTitle(battle?.title);
  const homeTeamName = gameScore?.strHomeTeam || derivedHomeTeam;
  const awayTeamName = gameScore?.strAwayTeam || derivedAwayTeam;

  const creatorParticipant = participants.find(p => p.user_id === battle?.creator_id);
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
  }, [canJoin, joinerWinningTeam]);

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

    setJoining(true);
    const { error } = await BattleService.joinBattle({
      battleId,
      userId: user.id,
      pick: effectivePick,
    });
    setJoining(false);

    if (error) {
      Alert.alert('Join failed', error.message);
      return;
    }

    setPick('');
    Alert.alert('Joined!', 'You have successfully joined this battle.');
  };

  const handleResolve = async () => {
    if (!battleId) return;

    setResolving(true);
    const { error, winnerId } = await BattleService.resolveBattle(battleId);
    setResolving(false);

    if (error) {
      Alert.alert('Error', error.message || 'Failed to resolve battle');
      return;
    }

    if (winnerId) {
      Alert.alert('Battle Resolved', 'Winner determined!');
    } else {
      Alert.alert('Battle Resolved', 'No winner (tie or unmatched picks).');
    }
  };

  const handleShare = async () => {
    if (!battleId || sharing) return;
    setSharing(true);
    const result: AwardXpResult = await BattleService.shareResult(battleId);
    setSharing(false);
    if (result.success) {
      setShared(true);
      const msg = result.alreadyAwarded
        ? 'You already shared this result.'
        : `+${result.pointsAwarded} XP for sharing!`;
      Alert.alert('Shared', msg);
    } else {
      Alert.alert('Error', result.error || 'Failed to share result');
    }
  };

  const matchEnded = gameScore && gameScore.intHomeScore !== null && gameScore.intAwayScore !== null;
  const canResolve = battle?.status === 'active' && matchEnded && (isCreator || alreadyJoined);

  const getWinnerName = (winnerId: string | null) => {
    if (!winnerId) return 'No winner';
    const winner = participants.find(p => p.user_id === winnerId);
    if (winner?.user_id === user?.id) return 'You';
    return `Player (${winnerId.slice(0, 8)}...)`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#4CAF50';
      case 'active':
        return COLORS.primary;
      case 'completed':
        return COLORS.textSecondary;
      case 'canceled':
        return COLORS.textSecondary;
      default:
        return COLORS.primary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!battle) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Battle Not Found</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Battle Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Battle Info Card */}
        <View style={styles.battleCard}>
          <View style={styles.battleHeader}>
            <View style={styles.battleIcon}>
              <Text style={styles.battleIconText}>⚔️</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(battle.status) }]}>
              <Text style={styles.statusText}>{battle.status.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.battleTitle}>{battle.title}</Text>
          
          {battle.description && (
            <Text style={styles.battleDescription}>{battle.description}</Text>
          )}

          <View style={styles.battleMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="flash" size={16} color={COLORS.primary} />
              <Text style={styles.metaLabel}>Stake:</Text>
              <Text style={styles.metaValue}>{battle.stake} BC</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaLabel}>Created:</Text>
              <Text style={styles.metaValue}>{formatDate(battle.created_at)}</Text>
            </View>
            {battle.event_id && (
              <View style={styles.metaItem}>
                <Ionicons name="football-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.metaLabel}>Event:</Text>
                <Text style={styles.metaValue}>{battle.event_id}</Text>
              </View>
            )}
          </View>

          {isCreator && (
            <View style={styles.creatorBadge}>
              <Ionicons name="star" size={14} color={COLORS.primary} />
              <Text style={styles.creatorText}>You created this battle</Text>
            </View>
          )}
        </View>

        {/* Live Score Section */}
        {gameScore && (
          <View style={styles.scoreCard}>
            <Text style={styles.scoreSectionTitle}>
              {battle.status === 'completed' ? 'Final Score' : 'Live Score'}
            </Text>
            <View style={styles.scoreDisplay}>
              <View style={styles.teamScore}>
                <Text style={styles.teamName}>{gameScore.strHomeTeam}</Text>
                <Text style={styles.scoreValue}>{gameScore.intHomeScore ?? '-'}</Text>
              </View>
              <Text style={styles.scoreDivider}>vs</Text>
              <View style={styles.teamScore}>
                <Text style={styles.teamName}>{gameScore.strAwayTeam}</Text>
                <Text style={styles.scoreValue}>{gameScore.intAwayScore ?? '-'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Winner Display for Completed Battles */}
        {battle.status === 'completed' && (
          <View style={styles.winnerCard}>
            <Ionicons name="trophy" size={32} color="#FFD700" />
            <Text style={styles.winnerTitle}>Battle Resolved</Text>
            <Text style={styles.winnerName}>
              Winner: {getWinnerName(battle.winner_id)}
            </Text>
            {battle.final_outcome && (
              <View style={styles.outcomeDetails}>
                <Text style={styles.outcomeText}>
                  {battle.final_outcome.home_team}: {battle.final_outcome.home_score}
                </Text>
                <Text style={styles.outcomeText}>
                  {battle.final_outcome.away_team}: {battle.final_outcome.away_score}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Resolve Battle Button */}
        {canResolve && (
          <TouchableOpacity
            style={[styles.resolveButton, resolving && styles.resolveButtonDisabled]}
            onPress={handleResolve}
            disabled={resolving}
          >
            {resolving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="checkmark-done" size={20} color={COLORS.white} />
                <Text style={styles.resolveButtonText}>Resolve Battle</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Participants Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Participants ({participants.length})
          </Text>
          
          {participants.length === 0 ? (
            <View style={styles.emptyParticipants}>
              <Ionicons name="people-outline" size={32} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No participants yet</Text>
              <Text style={styles.emptySubtext}>Be the first to join!</Text>
            </View>
          ) : (
            <View style={styles.participantsList}>
              {participants.map((participant, index) => (
                <View key={participant.id} style={styles.participantCard}>
                  <View style={styles.participantLeft}>
                    <View style={styles.participantAvatar}>
                      <Ionicons name="person" size={20} color={COLORS.textSecondary} />
                    </View>
                    <View style={styles.participantInfo}>
                      <Text style={styles.participantName}>
                        {participant.user_id === user?.id ? 'You' : `Player ${index + 1}`}
                      </Text>
                      <Text style={styles.participantJoined}>
                        Joined {formatDate(participant.joined_at)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.pickBadge}>
                    <Text style={styles.pickLabel}>Pick:</Text>
                    <Text style={styles.pickValue}>{participant.pick || '-'}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Join Section */}
        {canJoin && (
          <View style={styles.joinSection}>
            <Text style={styles.sectionTitle}>Join This Battle</Text>
            <View style={styles.joinCard}>
              {isHeadToHeadReady ? (
                <>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeLabel}>Creator's prediction:</Text>
                    <View style={styles.predictionBox}>
                      <Ionicons name="person" size={16} color={COLORS.primary} />
                      <Text style={styles.predictionTeam}>{creatorWinningTeam} will win</Text>
                    </View>
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeLabel}>Your side (if you accept):</Text>
                    <View style={[styles.predictionBox, styles.yourPredictionBox]}>
                      <Ionicons name="flash" size={16} color="#4CAF50" />
                      <Text style={[styles.predictionTeam, styles.yourPredictionTeam]}>{joinerWinningTeam} will win</Text>
                    </View>
                  </View>
                </>
              ) : homeTeamName && awayTeamName ? (
                <>
                  <Text style={styles.joinLabel}>Pick the winner:</Text>
                  <View style={styles.teamPickContainer}>
                    <TouchableOpacity
                      style={[
                        styles.teamPickButton,
                        pick === homeTeamName && styles.teamPickButtonSelected,
                      ]}
                      onPress={() => setPick(homeTeamName)}
                    >
                      <Text style={[
                        styles.teamPickText,
                        pick === homeTeamName && styles.teamPickTextSelected,
                      ]}>
                        {homeTeamName}
                      </Text>
                      <Text style={styles.teamPickLabel}>Home</Text>
                    </TouchableOpacity>
                    <Text style={styles.vsText}>vs</Text>
                    <TouchableOpacity
                      style={[
                        styles.teamPickButton,
                        pick === awayTeamName && styles.teamPickButtonSelected,
                      ]}
                      onPress={() => setPick(awayTeamName)}
                    >
                      <Text style={[
                        styles.teamPickText,
                        pick === awayTeamName && styles.teamPickTextSelected,
                      ]}>
                        {awayTeamName}
                      </Text>
                      <Text style={styles.teamPickLabel}>Away</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.loadingPickText}>Unable to determine teams for this battle</Text>
              )}
              <TouchableOpacity
                style={[
                  styles.joinButton,
                  (joining || (!pick && !isHeadToHeadReady)) &&
                    styles.joinButtonDisabled,
                ]}
                onPress={handleJoin}
                disabled={joining || (!pick && !isHeadToHeadReady)}
              >
                {joining ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons name="enter-outline" size={20} color={COLORS.white} />
                    <Text style={styles.joinButtonText}>{isHeadToHeadBattle ? 'Accept Challenge' : 'Join Battle'}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {alreadyJoined && !isCreator && (
          <View style={styles.joinedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.joinedText}>You have joined this battle</Text>
          </View>
        )}

        {battle.status === 'completed' && (isCreator || alreadyJoined) && (
          <TouchableOpacity
            style={[styles.shareButton, (sharing || shared) && styles.shareButtonDisabled]}
            onPress={handleShare}
            disabled={sharing || shared}
          >
            {sharing ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name={shared ? 'checkmark-circle' : 'share-social-outline'} size={20} color={COLORS.white} />
                <Text style={styles.shareButtonText}>{shared ? 'Shared' : 'Share Result (+10 XP)'}</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
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
    paddingVertical: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  battleCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  battleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleIconText: {
    fontSize: 24,
  },
  statusBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  battleTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  battleDescription: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    marginBottom: SIZES.padding,
    lineHeight: 22,
  },
  battleMeta: {
    gap: SIZES.base,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  metaLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  metaValue: {
    color: COLORS.text,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    marginTop: SIZES.padding,
    paddingTop: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
  },
  creatorText: {
    color: COLORS.primary,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
  },
  emptyParticipants: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 2,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    marginTop: SIZES.base,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginTop: 4,
  },
  participantsList: {
    gap: SIZES.base,
  },
  participantCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantInfo: {},
  participantName: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  participantJoined: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  pickBadge: {
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pickLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  pickValue: {
    color: COLORS.text,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  joinSection: {
    marginBottom: SIZES.padding * 2,
  },
  joinCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  joinLabel: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  teamPickContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
    gap: SIZES.base,
  },
  teamPickButton: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.inputBorder,
  },
  teamPickButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  teamPickText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  teamPickTextSelected: {
    color: COLORS.primary,
  },
  teamPickLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginTop: 4,
  },
  vsText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  loadingPickText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    color: COLORS.text,
    fontSize: SIZES.font,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginBottom: SIZES.padding,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: SIZES.base,
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  joinedText: {
    color: '#4CAF50',
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  scoreCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  scoreSectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  scoreDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  teamScore: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  scoreValue: {
    color: COLORS.text,
    fontSize: SIZES.extraLarge || 28,
    fontWeight: 'bold',
  },
  scoreDivider: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    marginHorizontal: SIZES.base,
  },
  winnerCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 1.5,
    marginBottom: SIZES.padding,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  winnerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: SIZES.base,
  },
  winnerName: {
    color: '#FFD700',
    fontSize: SIZES.font,
    fontWeight: '600',
    marginTop: SIZES.base,
  },
  outcomeDetails: {
    marginTop: SIZES.padding,
    alignItems: 'center',
  },
  outcomeText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginTop: 4,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  resolveButtonDisabled: {
    opacity: 0.7,
  },
  resolveButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  challengeInfo: {
    marginBottom: SIZES.padding,
  },
  challengeLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: SIZES.base,
  },
  predictionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    backgroundColor: COLORS.inputBackground,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  predictionTeam: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  yourPredictionBox: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  yourPredictionTeam: {
    color: '#4CAF50',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding,
    gap: SIZES.base,
  },
  shareButtonDisabled: {
    opacity: 0.6,
  },
  shareButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
});
