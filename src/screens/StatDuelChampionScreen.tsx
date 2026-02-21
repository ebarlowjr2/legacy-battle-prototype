import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

interface StatDuelChampionScreenProps {
  navigation: any;
  route: any;
}

// Mock players with position codes for filtering
const MOCK_PLAYERS = [
  { id: '1', name: 'Patrick Mahomes', team: 'Kansas City Chiefs', position: 'Quarterback', positionCode: 'QB', sport: 'NFL' },
  { id: '2', name: 'Josh Allen', team: 'Buffalo Bills', position: 'Quarterback', positionCode: 'QB', sport: 'NFL' },
  { id: '3', name: 'Travis Kelce', team: 'Kansas City Chiefs', position: 'Tight End', positionCode: 'TE', sport: 'NFL' },
  { id: '4', name: 'George Kittle', team: 'San Francisco 49ers', position: 'Tight End', positionCode: 'TE', sport: 'NFL' },
  { id: '5', name: 'Tyreek Hill', team: 'Miami Dolphins', position: 'Wide Receiver', positionCode: 'WR', sport: 'NFL' },
  { id: '6', name: 'Davante Adams', team: 'Las Vegas Raiders', position: 'Wide Receiver', positionCode: 'WR', sport: 'NFL' },
  { id: '7', name: 'Derrick Henry', team: 'Tennessee Titans', position: 'Running Back', positionCode: 'RB', sport: 'NFL' },
  { id: '8', name: 'Saquon Barkley', team: 'New York Giants', position: 'Running Back', positionCode: 'RB', sport: 'NFL' },
  { id: '9', name: 'Harrison Butker', team: 'Kansas City Chiefs', position: 'Kicker', positionCode: 'K', sport: 'NFL' },
  { id: '10', name: 'Justin Tucker', team: 'Baltimore Ravens', position: 'Kicker', positionCode: 'K', sport: 'NFL' },
  { id: '11', name: 'San Francisco 49ers', team: '49ers Defense', position: 'Defense', positionCode: 'DEF', sport: 'NFL' },
  { id: '12', name: 'Dallas Cowboys', team: 'Cowboys Defense', position: 'Defense', positionCode: 'DEF', sport: 'NFL' },
  { id: '13', name: 'Stephen Curry', team: 'Golden State Warriors', position: 'Point Guard', positionCode: 'PG', sport: 'NBA' },
  { id: '14', name: 'Kyrie Irving', team: 'Dallas Mavericks', position: 'Point Guard', positionCode: 'PG', sport: 'NBA' },
  { id: '15', name: 'Devin Booker', team: 'Phoenix Suns', position: 'Shooting Guard', positionCode: 'SG', sport: 'NBA' },
  { id: '16', name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', position: 'Shooting Guard', positionCode: 'SG', sport: 'NBA' },
  { id: '17', name: 'LeBron James', team: 'Los Angeles Lakers', position: 'Small Forward', positionCode: 'SF', sport: 'NBA' },
  { id: '18', name: 'Kevin Durant', team: 'Phoenix Suns', position: 'Small Forward', positionCode: 'SF', sport: 'NBA' },
  { id: '19', name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', position: 'Power Forward', positionCode: 'PF', sport: 'NBA' },
  { id: '20', name: 'Jayson Tatum', team: 'Boston Celtics', position: 'Power Forward', positionCode: 'PF', sport: 'NBA' },
  { id: '21', name: 'Nikola Jokic', team: 'Denver Nuggets', position: 'Center', positionCode: 'C', sport: 'NBA' },
  { id: '22', name: 'Joel Embiid', team: 'Philadelphia 76ers', position: 'Center', positionCode: 'C', sport: 'NBA' },
  { id: '23', name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', position: 'Pitcher', positionCode: 'P', sport: 'MLB' },
  { id: '24', name: 'Gerrit Cole', team: 'New York Yankees', position: 'Pitcher', positionCode: 'P', sport: 'MLB' },
  { id: '25', name: 'J.T. Realmuto', team: 'Philadelphia Phillies', position: 'Catcher', positionCode: 'C', sport: 'MLB' },
  { id: '26', name: 'Will Smith', team: 'Los Angeles Dodgers', position: 'Catcher', positionCode: 'C', sport: 'MLB' },
  { id: '27', name: 'Freddie Freeman', team: 'Los Angeles Dodgers', position: 'First Base', positionCode: '1B', sport: 'MLB' },
  { id: '28', name: 'Matt Olson', team: 'Atlanta Braves', position: 'First Base', positionCode: '1B', sport: 'MLB' },
  { id: '29', name: 'Marcus Semien', team: 'Texas Rangers', position: 'Second Base', positionCode: '2B', sport: 'MLB' },
  { id: '30', name: 'Jose Altuve', team: 'Houston Astros', position: 'Second Base', positionCode: '2B', sport: 'MLB' },
  { id: '31', name: 'Trea Turner', team: 'Philadelphia Phillies', position: 'Shortstop', positionCode: 'SS', sport: 'MLB' },
  { id: '32', name: 'Corey Seager', team: 'Texas Rangers', position: 'Shortstop', positionCode: 'SS', sport: 'MLB' },
  { id: '33', name: 'Manny Machado', team: 'San Diego Padres', position: 'Third Base', positionCode: '3B', sport: 'MLB' },
  { id: '34', name: 'Rafael Devers', team: 'Boston Red Sox', position: 'Third Base', positionCode: '3B', sport: 'MLB' },
  { id: '35', name: 'Aaron Judge', team: 'New York Yankees', position: 'Outfield', positionCode: 'OF', sport: 'MLB' },
  { id: '36', name: 'Mike Trout', team: 'Los Angeles Angels', position: 'Outfield', positionCode: 'OF', sport: 'MLB' },
  { id: '37', name: 'Connor McDavid', team: 'Edmonton Oilers', position: 'Center', positionCode: 'C', sport: 'NHL' },
  { id: '38', name: 'Auston Matthews', team: 'Toronto Maple Leafs', position: 'Center', positionCode: 'C', sport: 'NHL' },
  { id: '39', name: 'Alex Ovechkin', team: 'Washington Capitals', position: 'Left Wing', positionCode: 'LW', sport: 'NHL' },
  { id: '40', name: 'Artemi Panarin', team: 'New York Rangers', position: 'Left Wing', positionCode: 'LW', sport: 'NHL' },
  { id: '41', name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', position: 'Right Wing', positionCode: 'RW', sport: 'NHL' },
  { id: '42', name: 'Patrick Kane', team: 'Detroit Red Wings', position: 'Right Wing', positionCode: 'RW', sport: 'NHL' },
  { id: '43', name: 'Cale Makar', team: 'Colorado Avalanche', position: 'Defenseman', positionCode: 'D', sport: 'NHL' },
  { id: '44', name: 'Victor Hedman', team: 'Tampa Bay Lightning', position: 'Defenseman', positionCode: 'D', sport: 'NHL' },
  { id: '45', name: 'Connor Hellebuyck', team: 'Winnipeg Jets', position: 'Goalie', positionCode: 'G', sport: 'NHL' },
  { id: '46', name: 'Igor Shesterkin', team: 'New York Rangers', position: 'Goalie', positionCode: 'G', sport: 'NHL' },
];

const DIRECTION_OPTIONS = [
  { id: 'MOST', name: 'Most' },
  { id: 'LEAST', name: 'Least' },
];

const STAT_CATEGORIES_BY_SPORT: Record<string, { id: string; name: string }[]> = {
  NFL: [
    { id: 'passing_yards', name: 'Passing Yards' },
    { id: 'rushing_yards', name: 'Rushing Yards' },
    { id: 'receiving_yards', name: 'Receiving Yards' },
    { id: 'touchdowns', name: 'Touchdowns' },
    { id: 'receptions', name: 'Receptions' },
    { id: 'interceptions', name: 'Interceptions' },
  ],
  NBA: [
    { id: 'points', name: 'Points' },
    { id: 'rebounds', name: 'Rebounds' },
    { id: 'assists', name: 'Assists' },
    { id: 'steals', name: 'Steals' },
    { id: 'blocks', name: 'Blocks' },
    { id: 'three_pointers', name: 'Three Pointers' },
  ],
  MLB: [
    { id: 'home_runs', name: 'Home Runs' },
    { id: 'rbis', name: 'RBIs' },
    { id: 'batting_average', name: 'Batting Average' },
    { id: 'stolen_bases', name: 'Stolen Bases' },
    { id: 'strikeouts', name: 'Strikeouts' },
    { id: 'era', name: 'ERA' },
  ],
  NHL: [
    { id: 'goals', name: 'Goals' },
    { id: 'assists', name: 'Assists' },
    { id: 'points', name: 'Points' },
    { id: 'plus_minus', name: 'Plus/Minus' },
    { id: 'saves', name: 'Saves' },
    { id: 'penalty_minutes', name: 'Penalty Minutes' },
  ],
};

const STAKE_OPTIONS = [
  { id: '10', name: '10 BC' },
  { id: '25', name: '25 BC' },
  { id: '50', name: '50 BC' },
  { id: '100', name: '100 BC' },
  { id: '250', name: '250 BC' },
];

export default function StatDuelChampionScreen({ navigation, route }: StatDuelChampionScreenProps) {
  const { visibility, battleMode, sport, game, position, positionName } = route?.params || {};
  
  // Determine if this is Standard-like mode (needs direction selection)
  const isStandardMode = battleMode === 'STANDARD' || battleMode === 'BOTH_PICKS';
  const isFantasyMode = battleMode === 'FANTASY';
  
  const [selectedPlayer, setSelectedPlayer] = useState<typeof MOCK_PLAYERS[0] | null>(null);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [selectedStake, setSelectedStake] = useState<string>('50');
  const [selectedDirection, setSelectedDirection] = useState<string>(isFantasyMode ? 'MOST' : '');
  
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showDirectionModal, setShowDirectionModal] = useState(false);
  const [playerSearch, setPlayerSearch] = useState('');

  // Filter players by position and sport, then by search
  const filteredPlayers = MOCK_PLAYERS.filter(p => {
    // Filter by sport if provided
    if (sport && p.sport !== sport) return false;
    // Filter by position if provided
    if (position && p.positionCode !== position) return false;
    // Filter by search
    return p.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
           p.team.toLowerCase().includes(playerSearch.toLowerCase());
  });

  const statCategories = STAT_CATEGORIES_BY_SPORT[sport] || STAT_CATEGORIES_BY_SPORT.NFL;
  const selectedStatData = statCategories.find(s => s.id === selectedStat);
  const selectedDirectionData = DIRECTION_OPTIONS.find(d => d.id === selectedDirection);

  const handleContinue = () => {
    navigation.navigate('StatDuelOpponent', {
      visibility,
      battleMode,
      sport,
      game,
      position,
      positionName,
      player: selectedPlayer,
      statCategory: selectedStatData,
      stake: selectedStake,
      direction: selectedDirection,
      directionName: selectedDirectionData?.name,
    });
  };

  // Validation: Standard needs direction, Fantasy defaults to MOST
  const canContinue = isStandardMode 
    ? (selectedPlayer && selectedStat && selectedStake && selectedDirection)
    : (selectedPlayer && selectedStat && selectedStake);

  const getStatDescription = () => {
    if (!selectedStatData || !selectedPlayer) return '';
    return `Compare Total ${selectedStatData.name} For Both Players`;
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelDetails', { visibility, battleMode });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <View style={styles.backButtonInner}>
              <Ionicons name="arrow-back" size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Create Battle</Text>
            <View style={styles.headerIcon}>
              <Ionicons name="globe-outline" size={18} color={COLORS.text} />
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          <Text style={styles.progressText}>4/6</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Choose Your Champion And The Dueling Stats</Text>
          <Text style={styles.sectionSubtitle}>Choose Stats To Battle On</Text>
        </View>

        {/* Player Selection */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>
            Pick Player * <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} />
          </Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowPlayerModal(true)}>
            <Text style={[styles.dropdownText, !selectedPlayer && styles.dropdownPlaceholder]}>
              {selectedPlayer ? selectedPlayer.name : 'pick players'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stat Category Selection */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>
            Stat Category * <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} />
          </Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowStatModal(true)}>
            <Text style={[styles.dropdownText, !selectedStat && styles.dropdownPlaceholder]}>
              {selectedStatData?.name || 'Select stat category'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Direction Selection - Only for Standard mode */}
        {isStandardMode && (
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>
              Choose Direction * <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} />
            </Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowDirectionModal(true)}>
              <Text style={[styles.dropdownText, !selectedDirection && styles.dropdownPlaceholder]}>
                {selectedDirectionData?.name || 'Select direction (Most/Least)'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Stake Selection */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>
            Stake BC <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} />
          </Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowStakeModal(true)}>
            <Text style={styles.dropdownText}>{selectedStake} BC</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stat Description */}
        {selectedPlayer && selectedStat && (
          <View style={styles.statDescriptionContainer}>
            <Text style={styles.statDescriptionTitle}>Stat Description</Text>
            <Text style={styles.statDescriptionText}>{getStatDescription()}</Text>
          </View>
        )}

        {/* Official Rules */}
        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>Official Rules</Text>
          <Text style={styles.rulesText}>
            Tie Rule: If Both QBs Have Same Passing Yards — Tie.{'\n'}
            Minimum Attempts: x10 Passes Required For Each QB.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <View style={styles.continueIcon}>
            <Text style={styles.continueIconText}>⚔</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Player Selection Modal */}
      <Modal visible={showPlayerModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Player/Teams</Text>
              <TouchableOpacity onPress={() => setShowPlayerModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search players..."
                placeholderTextColor={COLORS.textMuted}
                value={playerSearch}
                onChangeText={setPlayerSearch}
              />
            </View>

            <View style={styles.filterTabs}>
              <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
                <Ionicons name="person-outline" size={16} color={COLORS.white} />
                <Text style={styles.filterTabTextActive}>Ps</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTab}>
                <Ionicons name="filter-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.filterTabText}>Filter</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.playerList}>
              {filteredPlayers.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerOption}
                  onPress={() => {
                    setSelectedPlayer(player);
                    setShowPlayerModal(false);
                    setPlayerSearch('');
                  }}
                >
                  <View style={styles.playerAvatar}>
                    <Text style={styles.playerAvatarText}>
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerTeam}>{player.position}</Text>
                  </View>
                  <View style={styles.playerTeamBadge}>
                    <Text style={styles.playerTeamName}>{player.team}</Text>
                    <View style={styles.activeIndicator}>
                      <View style={styles.activeDot} />
                      <Text style={styles.activeText}>Active</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Stat Category Modal */}
      <Modal visible={showStatModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Stat Category</Text>
              <TouchableOpacity onPress={() => setShowStatModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {statCategories.map((stat) => (
              <TouchableOpacity
                key={stat.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedStat(stat.id);
                  setShowStatModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{stat.name}</Text>
                {selectedStat === stat.id && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Stake Modal */}
      <Modal visible={showStakeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Stake</Text>
              <TouchableOpacity onPress={() => setShowStakeModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {STAKE_OPTIONS.map((stake) => (
              <TouchableOpacity
                key={stake.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedStake(stake.id);
                  setShowStakeModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{stake.name}</Text>
                {selectedStake === stake.id && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Direction Modal - Only for Standard mode */}
      <Modal visible={showDirectionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Direction</Text>
              <TouchableOpacity onPress={() => setShowDirectionModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.directionHelpText}>
              Choose whether your player should have the MOST or LEAST in the selected stat category.
              Your opponent will automatically get the opposite direction.
            </Text>
            {DIRECTION_OPTIONS.map((direction) => (
              <TouchableOpacity
                key={direction.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedDirection(direction.id);
                  setShowDirectionModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{direction.name}</Text>
                {selectedDirection === direction.id && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonInner: {
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
    gap: SIZES.base,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  titleSection: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  dropdownContainer: {
    marginBottom: SIZES.padding,
  },
  dropdownLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: SIZES.base,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  dropdownText: {
    color: COLORS.text,
    fontSize: SIZES.font,
  },
  dropdownPlaceholder: {
    color: COLORS.textMuted,
  },
  statDescriptionContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  statDescriptionTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  statDescriptionText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  rulesContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  rulesTitle: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  rulesText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  continueIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueIconText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  directionHelpText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    lineHeight: 18,
    marginBottom: SIZES.padding,
    paddingHorizontal: SIZES.base,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    gap: SIZES.base,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.font,
    paddingVertical: SIZES.padding,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    gap: SIZES.base / 2,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  filterTabTextActive: {
    color: COLORS.white,
    fontSize: SIZES.small,
  },
  playerList: {
    maxHeight: 400,
  },
  playerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
    gap: SIZES.base,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerAvatarText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  playerTeam: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
  },
  playerTeamBadge: {
    alignItems: 'flex-end',
  },
  playerTeamName: {
    color: COLORS.text,
    fontSize: SIZES.small,
    marginBottom: 2,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  activeText: {
    color: '#22c55e',
    fontSize: 10,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  modalOptionText: {
    color: COLORS.text,
    fontSize: SIZES.font,
  },
});
