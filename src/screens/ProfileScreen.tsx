import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { XpService } from '../services/xpService';

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: string;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
};

type BattleStats = {
  wins: number;
  losses: number;
  challenges: number;
};

export default function ProfileScreen({ navigation }: any) {
  const { signOut, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [battleStats, setBattleStats] = useState<BattleStats>({ wins: 0, losses: 0, challenges: 0 });
  const [previousLevel, setPreviousLevel] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile', error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    const loadBattleStats = async () => {
      const { data: participations } = await supabase
        .from('battle_participants')
        .select('battle_id, is_winner, battles!inner(status)')
        .eq('user_id', user.id);

      if (participations) {
        const completed = participations.filter((p: any) => p.battles?.status === 'resolved');
        const wins = completed.filter((p: any) => p.is_winner === true).length;
        const losses = completed.filter((p: any) => p.is_winner === false).length;
        const challenges = participations.length;
        setBattleStats({ wins, losses, challenges });
      }
    };

    loadProfile();
    loadBattleStats();
  }, [user]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      
      // Check for level-up and show toast
      const currentLevel = profile.level || 'Challenger';
      if (previousLevel && previousLevel !== currentLevel) {
        // Level changed - show rank-up toast
        const nextRankMessage = getNextRankMessage(currentLevel);
        Alert.alert(
          'Rank Up!',
          `You're now a ${currentLevel}! ${nextRankMessage}`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      }
      setPreviousLevel(currentLevel);
    }
  }, [profile]);

  // Helper to get motivational message for next rank
  const getNextRankMessage = (rank: string) => {
    switch (rank) {
      case 'Contender': return 'Keep stacking verified challenges to reach Rival.';
      case 'Rival': return 'You\'re climbing! Warrior status awaits at 1,500 XP.';
      case 'Warrior': return 'Battle on! Champion is within reach at 5,000 XP.';
      case 'Champion': return 'Elite status! Legend awaits at 15,000 XP.';
      case 'Legend': return 'You\'ve reached the pinnacle. You are a Legend!';
      default: return 'Keep battling to rank up!';
    }
  };

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profiles-change')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setProfile(payload.new as Profile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      Alert.alert('Update Failed', error.message);
    } else {
      Alert.alert('Updated', 'Your profile was updated.');
      setIsEditing(false);
      if (profile) {
        setProfile({ ...profile, display_name: displayName });
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        },
      ]
    );
  };

  const walletBalance = Number(profile?.wallet_balance || 0).toFixed(2);
  const xpValue = profile?.xp || 0;
  const levelValue = profile?.level || 'Challenger';
  const avatarInitials = (profile?.display_name || profile?.username || user?.email || 'U')
    .substring(0, 2)
    .toUpperCase();

  // Use XpService for consistent rank calculation across the app
  const rankInfo = XpService.getRankInfo(xpValue);
  
  // Map rank to level number for display
  const getLevelNumber = (rank: string) => {
    switch (rank) {
      case 'Legend': return 50;
      case 'Champion': return 40;
      case 'Warrior': return 30;
      case 'Rival': return 20;
      case 'Contender': return 10;
      default: return 1;
    }
  };

  const levelInfo = {
    level: rankInfo.currentRank,
    nextLevel: rankInfo.nextRank,
    progress: rankInfo.progress,
    nextXp: rankInfo.nextThreshold,
  };
  const levelNumber = getLevelNumber(rankInfo.currentRank);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
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
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Ionicons name="person-outline" size={18} color={COLORS.primary} />
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarInitials}</Text>
            </View>
          </View>
          
          <Text style={styles.username}>{profile?.display_name || profile?.username || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          {/* Level Badge */}
          <View style={styles.levelBadgeContainer}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={styles.levelBadgeText}>
              {levelInfo.level} Level {levelNumber}
            </Text>
            <Text style={styles.levelXpText}>  {xpValue.toLocaleString()} XP</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, styles.statBoxGreen]}>
            <Text style={[styles.statValue, styles.statValueGreen]}>{battleStats.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxRed]}>
            <Text style={[styles.statValue, styles.statValueRed]}>{battleStats.losses}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxBlue]}>
            <Text style={[styles.statValue, styles.statValueBlue]}>{battleStats.challenges}</Text>
            <Text style={styles.statLabel}>Challenges</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxGray]}>
            <Text style={styles.statValue}>{Number(walletBalance).toLocaleString()}</Text>
            <Text style={styles.statLabel}>BC Coins</Text>
          </View>
        </View>

        {/* Legacy Rank Card */}
        <View style={styles.rankCard}>
          <View style={styles.rankHeader}>
            <Text style={styles.rankTitle}>Legacy Rank</Text>
            <Text style={styles.rankLevel}>{levelInfo.level}</Text>
          </View>
          <View style={styles.rankProgressContainer}>
            <View style={styles.rankProgressBar}>
              <View style={[styles.rankProgress, { width: `${levelInfo.progress}%` }]} />
            </View>
          </View>
          <View style={styles.rankFooter}>
            <Text style={styles.rankXpText}>{xpValue.toLocaleString()} XP</Text>
            <Text style={styles.rankNextText}>{levelInfo.nextLevel}: {levelInfo.nextXp.toLocaleString()} XP</Text>
          </View>
          
          {/* Battle Invitation */}
          <TouchableOpacity style={styles.invitationBanner}>
            <Text style={styles.invitationText}>You Have Pending Battle Invites</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Total BC Card */}
        <View style={styles.bcCard}>
          <View style={styles.bcLeft}>
            <Text style={styles.bcLabel}>Total Bc</Text>
            <Text style={styles.bcValue}>{Number(walletBalance).toLocaleString()} BC</Text>
          </View>
          <View style={styles.bcRight}>
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewMoreButton}>
              <Text style={styles.viewMoreText}>View More</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {/* Achievements */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="trophy-outline" size={22} color={COLORS.text} />
            </View>
            <Text style={styles.menuItemText}>Achievements</Text>
            <View style={styles.menuRight}>
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>12</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Statistics */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="stats-chart-outline" size={22} color={COLORS.text} />
            </View>
            <Text style={styles.menuItemText}>Statistics</Text>
            <View style={styles.menuRight}>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Friends */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Friends')}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="people-outline" size={22} color={COLORS.text} />
            </View>
            <Text style={styles.menuItemText}>Friends</Text>
            <View style={styles.menuRight}>
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>5</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Wallet */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="wallet-outline" size={22} color={COLORS.text} />
            </View>
            <Text style={styles.menuItemText}>Wallet</Text>
            <View style={styles.menuRight}>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
            </View>
            <Text style={styles.menuItemText}>Notifications</Text>
            <View style={styles.menuRight}>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.text} />
            </View>
            <Text style={styles.menuItemText}>Help & Support</Text>
            <View style={styles.menuRight}>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  avatarContainer: {
    marginBottom: SIZES.base,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.inputBorder,
  },
  avatarText: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  username: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    marginBottom: SIZES.base,
  },
  levelBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: 20,
  },
  trophyIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  levelBadgeText: {
    color: COLORS.success,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  levelXpText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
    gap: SIZES.base,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    borderWidth: 1,
  },
  statBoxGreen: {
    borderColor: '#22c55e',
  },
  statBoxRed: {
    borderColor: COLORS.primary,
  },
  statBoxBlue: {
    borderColor: '#3b82f6',
  },
  statBoxGray: {
    borderColor: COLORS.inputBorder,
  },
  statValue: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statValueGreen: {
    color: '#22c55e',
  },
  statValueRed: {
    color: COLORS.primary,
  },
  statValueBlue: {
    color: '#3b82f6',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  rankCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  rankTitle: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  rankLevel: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  rankProgressContainer: {
    marginBottom: SIZES.base,
  },
  rankProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  rankProgress: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
  rankFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  rankXpText: {
    color: COLORS.white,
    fontSize: SIZES.small,
  },
  rankNextText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: SIZES.small,
  },
  invitationBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  invitationText: {
    color: COLORS.white,
    fontSize: SIZES.font,
  },
  bcCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  bcLeft: {},
  bcLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: 4,
  },
  bcValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  bcRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewMoreText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  socialCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  socialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  socialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  socialTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  moreDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreDetailsText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  socialSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  menuSection: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  menuItemText: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  menuBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: 'center',
  },
  menuBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
    paddingVertical: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  logoutText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
});
