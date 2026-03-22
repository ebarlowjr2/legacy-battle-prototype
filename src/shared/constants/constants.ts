import type {
  Sport,
  BattleCategory,
  BattleTypeOption,
  BattleModeOption,
  ExploreTab,
  StatDuelPlayer,
  StatDuelOpponent,
} from '@/shared/types';
import type { SelectionOption } from '@/shared/types';

export const TIMEOUT_DEFAULT_DELAY = 2000;

export const VERIFY_OTP_COOLDOWN_SEC = 120;

export const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:3000';

/** Digit count for email / reset OTP inputs (must match API and validation). */
export const OTP_LENGTH = 5;

// ─── Battles list tabs ─────────────────────────────────────────────────────

export const BATTLES_LIST_TABS: { key: string; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

// ─── Explore tabs ──────────────────────────────────────────────────────────

export const EXPLORE_TABS: ExploreTab[] = ['Trending', 'Ending Soon', 'New', 'High Activity'];

export const EXPLORE_TAB_SUBTITLES: Record<ExploreTab, string> = {
  Trending: 'Trending Battles',
  'Ending Soon': 'Challenges That Are About To End',
  New: 'Battle That Are New',
  'High Activity': 'All New Battle Created',
};

// ─── Start Battle screen ───────────────────────────────────────────────────

export const SPORTS: Sport[] = [
  { id: 'NFL', name: 'Football', icon: '🏈', color: '#013369' },
  { id: 'NBA', name: 'Basketball', icon: '🏀', color: '#C9082A' },
  { id: 'MLB', name: 'Baseball', icon: '⚾', color: '#002D72' },
  { id: 'NHL', name: 'Hockey', icon: '🏒', color: '#000000' },
  { id: 'SKILLS', name: 'Skills Battle', icon: '⚡', color: '#E53935' },
];

export const BATTLE_CATEGORIES: BattleCategory[] = [
  {
    id: 'GAME_WINNER',
    name: 'Game Winner',
    description: 'Pick which team will win the game',
    icon: 'trophy',
    enabled: true,
  },
  {
    id: 'OVER_UNDER',
    name: 'Over/Under',
    description: 'Predict if the total score will be over or under',
    icon: 'stats-chart',
    enabled: false,
  },
  {
    id: 'STATS_BATTLE',
    name: 'Stats Battle',
    description: 'Compare player statistics',
    icon: 'bar-chart',
    enabled: false,
  },
];

// ─── Battle type screen (theme color keys; resolve with colors in component) ──

export type BattleTypeRaw = Omit<BattleTypeOption, 'iconColor' | 'badgeColor'> & {
  iconColor: string;
  badgeColor: string;
};

export const BATTLE_TYPES: BattleTypeRaw[] = [
  {
    id: 'GAME_DUEL',
    name: 'Game Duel',
    description: 'Head-to-Head On Any Game.',
    icon: '🏆',
    iconColor: 'gold',
    badge: 'Oracle Verifies',
    badgeColor: 'primary',
    features: [
      { icon: 'checkmark-circle', text: 'Official Game Results' },
      { icon: 'flash', text: 'Instant Results' },
    ],
    enabled: true,
  },
  {
    id: 'STAT_DUEL',
    name: 'Stat Duel',
    description: 'Compete Using Real World Stats.',
    icon: '📊',
    iconColor: 'info',
    badge: 'Oracle Verifies',
    badgeColor: 'primary',
    features: [
      { icon: 'stats-chart', text: 'Official Stats' },
      { icon: 'flash', text: 'Instant Results' },
    ],
    enabled: true,
  },
  {
    id: 'SKILL_BATTLE',
    name: 'Skill Battle',
    description: 'Showcase Your Skills With Proof.',
    icon: '⚡',
    iconColor: 'primary',
    badge: 'Neutral Attester Verifies',
    badgeColor: '#9C27B0',
    features: [
      { icon: 'videocam', text: 'Video Evidence Needed' },
      { icon: 'people', text: '3 Neutral Attesters' },
    ],
    enabled: false,
  },
];

// ─── Stat duel mode screen (theme color key strings; resolve with colors in component) ─

export const BATTLE_MODES_RAW: {
  id: BattleModeOption['id'];
  name: string;
  description: string;
  features: { colorKey: string; text: string }[];
  borderColorKey: string;
}[] = [
  {
    id: 'STANDARD',
    name: 'Standard',
    description: 'Both Players Pick Athletes From The Same Game.',
    features: [
      { colorKey: 'primary', text: 'Pick From The Same Game' },
      { colorKey: 'gold', text: 'Locks At Game Kickoff' },
    ],
    borderColorKey: 'text',
  },
  {
    id: 'FANTASY',
    name: 'Fantasy Mode',
    description: 'Both Players Can Pick Athletes From Different Games, Same Week.',
    features: [
      { colorKey: 'primary', text: 'Any Match This Week' },
      { colorKey: 'gold', text: 'Locks At Earliest Kickoff' },
    ],
    borderColorKey: 'text',
  },
  {
    id: 'BOTH_PICKS',
    name: 'Both Picks',
    description: 'Both Players Pick Athletes From The Same Game And Battle On A Specific Stat.',
    features: [],
    borderColorKey: 'primary',
  },
];

// ─── Stat duel details (sport picker, mock games, positions) ─────────────────

export const STAT_DUEL_SPORTS = [
  { id: 'NFL', name: 'NFL', icon: '🏈' },
  { id: 'NBA', name: 'NBA', icon: '🏀' },
  { id: 'MLB', name: 'MLB', icon: '⚾' },
  { id: 'NHL', name: 'NHL', icon: '🏒' },
] as const;

export const MOCK_GAMES = [
  { id: '1', name: 'Chiefs vs Bills, Week 5', sport: 'NFL', homeTeam: 'Chiefs', awayTeam: 'Bills' },
  { id: '2', name: 'Cowboys vs Eagles, Week 5', sport: 'NFL', homeTeam: 'Cowboys', awayTeam: 'Eagles' },
  { id: '3', name: 'Lakers vs Celtics', sport: 'NBA', homeTeam: 'Lakers', awayTeam: 'Celtics' },
  { id: '4', name: 'Warriors vs Suns', sport: 'NBA', homeTeam: 'Warriors', awayTeam: 'Suns' },
] as const;

export const POSITIONS_BY_SPORT: Record<string, { id: string; name: string }[]> = {
  NFL: [
    { id: 'QB', name: 'Quarterback (QB)' },
    { id: 'RB', name: 'Running Back (RB)' },
    { id: 'WR', name: 'Wide Receiver (WR)' },
    { id: 'TE', name: 'Tight End (TE)' },
    { id: 'K', name: 'Kicker (K)' },
    { id: 'DEF', name: 'Defense (DEF)' },
  ],
  NBA: [
    { id: 'PG', name: 'Point Guard (PG)' },
    { id: 'SG', name: 'Shooting Guard (SG)' },
    { id: 'SF', name: 'Small Forward (SF)' },
    { id: 'PF', name: 'Power Forward (PF)' },
    { id: 'C', name: 'Center (C)' },
  ],
  MLB: [
    { id: 'P', name: 'Pitcher (P)' },
    { id: 'C', name: 'Catcher (C)' },
    { id: '1B', name: 'First Base (1B)' },
    { id: '2B', name: 'Second Base (2B)' },
    { id: 'SS', name: 'Shortstop (SS)' },
    { id: '3B', name: 'Third Base (3B)' },
    { id: 'OF', name: 'Outfield (OF)' },
  ],
  NHL: [
    { id: 'C', name: 'Center (C)' },
    { id: 'LW', name: 'Left Wing (LW)' },
    { id: 'RW', name: 'Right Wing (RW)' },
    { id: 'D', name: 'Defenseman (D)' },
    { id: 'G', name: 'Goalie (G)' },
  ],
};

// ─── Stat duel champion (mock players, direction, stat categories, stakes) ───

export const MOCK_PLAYERS: StatDuelPlayer[] = [
  { id: '1', name: 'Patrick Mahomes', team: 'Kansas City Chiefs', position: 'Quarterback', positionCode: 'QB', sport: 'NFL' },
  { id: '2', name: 'Josh Allen', team: 'Buffalo Bills', position: 'Quarterback', positionCode: 'QB', sport: 'NFL' },
  { id: '3', name: 'Derrick Henry', team: 'Tennessee Titans', position: 'Running Back', positionCode: 'RB', sport: 'NFL' },
  { id: '4', name: 'Christian McCaffrey', team: 'San Francisco 49ers', position: 'Running Back', positionCode: 'RB', sport: 'NFL' },
  { id: '5', name: 'Tyreek Hill', team: 'Miami Dolphins', position: 'Wide Receiver', positionCode: 'WR', sport: 'NFL' },
  { id: '6', name: 'Justin Jefferson', team: 'Minnesota Vikings', position: 'Wide Receiver', positionCode: 'WR', sport: 'NFL' },
  { id: '7', name: 'Travis Kelce', team: 'Kansas City Chiefs', position: 'Tight End', positionCode: 'TE', sport: 'NFL' },
  { id: '8', name: 'George Kittle', team: 'San Francisco 49ers', position: 'Tight End', positionCode: 'TE', sport: 'NFL' },
  { id: '9', name: 'Justin Tucker', team: 'Baltimore Ravens', position: 'Kicker', positionCode: 'K', sport: 'NFL' },
  { id: '10', name: 'Harrison Butker', team: 'Kansas City Chiefs', position: 'Kicker', positionCode: 'K', sport: 'NFL' },
  { id: '11', name: 'San Francisco 49ers', team: '49ers Defense', position: 'Defense', positionCode: 'DEF', sport: 'NFL' },
  { id: '12', name: 'Dallas Cowboys', team: 'Cowboys Defense', position: 'Defense', positionCode: 'DEF', sport: 'NFL' },
  { id: '13', name: 'Stephen Curry', team: 'Golden State Warriors', position: 'Point Guard', positionCode: 'PG', sport: 'NBA' },
  { id: '14', name: 'Luka Doncic', team: 'Dallas Mavericks', position: 'Point Guard', positionCode: 'PG', sport: 'NBA' },
  { id: '15', name: 'Devin Booker', team: 'Phoenix Suns', position: 'Shooting Guard', positionCode: 'SG', sport: 'NBA' },
  { id: '16', name: 'Anthony Edwards', team: 'Minnesota Timberwolves', position: 'Shooting Guard', positionCode: 'SG', sport: 'NBA' },
  { id: '17', name: 'LeBron James', team: 'Los Angeles Lakers', position: 'Small Forward', positionCode: 'SF', sport: 'NBA' },
  { id: '18', name: 'Jayson Tatum', team: 'Boston Celtics', position: 'Small Forward', positionCode: 'SF', sport: 'NBA' },
  { id: '19', name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', position: 'Power Forward', positionCode: 'PF', sport: 'NBA' },
  { id: '20', name: 'Kevin Durant', team: 'Phoenix Suns', position: 'Power Forward', positionCode: 'PF', sport: 'NBA' },
  { id: '21', name: 'Nikola Jokic', team: 'Denver Nuggets', position: 'Center', positionCode: 'C', sport: 'NBA' },
  { id: '22', name: 'Joel Embiid', team: 'Philadelphia 76ers', position: 'Center', positionCode: 'C', sport: 'NBA' },
  { id: '23', name: 'Gerrit Cole', team: 'New York Yankees', position: 'Pitcher', positionCode: 'P', sport: 'MLB' },
  { id: '24', name: 'Max Scherzer', team: 'Texas Rangers', position: 'Pitcher', positionCode: 'P', sport: 'MLB' },
  { id: '25', name: 'J.T. Realmuto', team: 'Philadelphia Phillies', position: 'Catcher', positionCode: 'C', sport: 'MLB' },
  { id: '26', name: 'Will Smith', team: 'Los Angeles Dodgers', position: 'Catcher', positionCode: 'C', sport: 'MLB' },
  { id: '27', name: 'Freddie Freeman', team: 'Los Angeles Dodgers', position: 'First Base', positionCode: '1B', sport: 'MLB' },
  { id: '28', name: 'Paul Goldschmidt', team: 'St. Louis Cardinals', position: 'First Base', positionCode: '1B', sport: 'MLB' },
  { id: '29', name: 'Mookie Betts', team: 'Los Angeles Dodgers', position: 'Second Base', positionCode: '2B', sport: 'MLB' },
  { id: '30', name: 'Jose Altuve', team: 'Houston Astros', position: 'Second Base', positionCode: '2B', sport: 'MLB' },
  { id: '31', name: 'Trea Turner', team: 'Philadelphia Phillies', position: 'Shortstop', positionCode: 'SS', sport: 'MLB' },
  { id: '32', name: 'Francisco Lindor', team: 'New York Mets', position: 'Shortstop', positionCode: 'SS', sport: 'MLB' },
  { id: '33', name: 'Nolan Arenado', team: 'St. Louis Cardinals', position: 'Third Base', positionCode: '3B', sport: 'MLB' },
  { id: '34', name: 'Jose Ramirez', team: 'Cleveland Guardians', position: 'Third Base', positionCode: '3B', sport: 'MLB' },
  { id: '35', name: 'Mike Trout', team: 'Los Angeles Angels', position: 'Outfield', positionCode: 'OF', sport: 'MLB' },
  { id: '36', name: 'Ronald Acuna Jr', team: 'Atlanta Braves', position: 'Outfield', positionCode: 'OF', sport: 'MLB' },
  { id: '37', name: 'Connor McDavid', team: 'Edmonton Oilers', position: 'Center', positionCode: 'C', sport: 'NHL' },
  { id: '38', name: 'Auston Matthews', team: 'Toronto Maple Leafs', position: 'Center', positionCode: 'C', sport: 'NHL' },
  { id: '39', name: 'Alex Ovechkin', team: 'Washington Capitals', position: 'Left Wing', positionCode: 'LW', sport: 'NHL' },
  { id: '40', name: 'Matthew Tkachuk', team: 'Florida Panthers', position: 'Left Wing', positionCode: 'LW', sport: 'NHL' },
  { id: '41', name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', position: 'Right Wing', positionCode: 'RW', sport: 'NHL' },
  { id: '42', name: 'David Pastrnak', team: 'Boston Bruins', position: 'Right Wing', positionCode: 'RW', sport: 'NHL' },
  { id: '43', name: 'Cale Makar', team: 'Colorado Avalanche', position: 'Defenseman', positionCode: 'D', sport: 'NHL' },
  { id: '44', name: 'Victor Hedman', team: 'Tampa Bay Lightning', position: 'Defenseman', positionCode: 'D', sport: 'NHL' },
  { id: '45', name: 'Igor Shesterkin', team: 'New York Rangers', position: 'Goalie', positionCode: 'G', sport: 'NHL' },
  { id: '46', name: 'Andrei Vasilevskiy', team: 'Tampa Bay Lightning', position: 'Goalie', positionCode: 'G', sport: 'NHL' },
];

export const DIRECTION_OPTIONS: SelectionOption[] = [
  { key: 'MOST', label: 'Most' },
  { key: 'LEAST', label: 'Least' },
];

export const STAT_CATEGORIES_BY_SPORT: Record<string, { id: string; name: string }[]> = {
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

export const STAKE_OPTIONS: SelectionOption[] = [
  { key: '10', label: '10 BC' },
  { key: '25', label: '25 BC' },
  { key: '50', label: '50 BC' },
  { key: '100', label: '100 BC' },
  { key: '250', label: '250 BC' },
];

// ─── Stat duel opponent (mock opponents) ─────────────────────────────────────

export const MOCK_OPPONENTS: StatDuelOpponent[] = [
  { id: '1', username: 'player1', display_name: 'Alex Johnson' },
  { id: '2', username: 'player2', display_name: 'Sarah Smith' },
  { id: '3', username: 'player3', display_name: 'Mike Brown' },
  { id: '4', username: 'player4', display_name: 'Emily Davis' },
  { id: '5', username: 'player5', display_name: 'Chris Wilson' },
];

// ─── Explore / home components ─────────────────────────────────────────────

export const EXPLORE_CATEGORIES = [
  { label: 'Football', emoji: '🏈' },
  { label: 'Basketball', emoji: '🏀' },
  { label: 'Baseball', emoji: '⚾' },
  { label: 'Soccer', emoji: '⚽' },
] as const;

export const TOP_PLAYERS = [
  { name: 'Champion', xp: 5000 },
  { name: 'Legend', xp: 4500 },
  { name: 'Pro', xp: 4000 },
  { name: 'Master', xp: 3500 },
] as const;

// ─── App / UI constants ─────────────────────────────────────────────────────

/** Toast visible duration in ms */
export const TOAST_DURATION_MS = 5000;

/** AsyncStorage key for theme mode preference */
export const THEME_STORAGE_KEY = '@lb_theme_mode';
