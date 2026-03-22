import { SportsRepo } from './sportsRepo';
import type { RepoGame, Team, League } from '@/shared/types';
import type { SportsEvent } from '@/shared/types';

export type { SportsEvent } from '@/shared/types';

const ENABLE_FALLBACK = process.env.EXPO_PUBLIC_ENABLE_SPORTS_FALLBACK === 'true';
const DEMO_API_KEY = '1' + '2' + '3';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${DEMO_API_KEY}`;

function mapSportToDisplay(sport: string): string {
  switch (sport.toUpperCase()) {
    case 'NBA':
      return 'Basketball';
    case 'NFL':
      return 'American Football';
    case 'MLB':
      return 'Baseball';
    case 'NHL':
      return 'Ice Hockey';
    default:
      return sport;
  }
}

function repoGameToSportsEvent(game: RepoGame): SportsEvent {
  return {
    idEvent: game.id,
    strEvent: game.display_name || `${game.home_team} vs ${game.away_team}`,
    strSport: mapSportToDisplay(game.sport),
    strLeague: game.league,
    strLeagueBadge: '',
    strHomeTeam: game.home_team || '',
    strAwayTeam: game.away_team || '',
    intHomeScore: game.home_score !== null ? String(game.home_score) : null,
    intAwayScore: game.away_score !== null ? String(game.away_score) : null,
    strTimestamp: game.start_time || '',
    dateEvent: game.start_time ? game.start_time.split('T')[0] : '',
    strTime: game.start_time ? new Date(game.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
    strTimeLocal: game.start_time ? new Date(game.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
    idHomeTeam: '',
    strHomeTeamBadge: '',
    idAwayTeam: '',
    strAwayTeamBadge: '',
    strVenue: game.venue || '',
    strCity: '',
    strPoster: null,
    strThumb: null,
    strStatus: game.status,
  };
}

export const LEAGUE_IDS = {
  NFL: '4391',
  NBA: '4387',
  MLB: '4424',
  NHL: '4380',
  MLS: '4346',
  EPL: '4328',
};

export async function getNextLeagueEvents(leagueId: string): Promise<SportsEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/eventsnextleague.php?id=${leagueId}`);
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching next league events:', error);
    return [];
  }
}

export async function getPreviousLeagueEvents(leagueId: string): Promise<SportsEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/eventspastleague.php?id=${leagueId}`);
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching previous league events:', error);
    return [];
  }
}

export async function getLeagueDetails(leagueId: string): Promise<League | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookupleague.php?id=${leagueId}`);
    const data = await response.json();
    return data.leagues?.[0] || null;
  } catch (error) {
    console.error('Error fetching league details:', error);
    return null;
  }
}

export async function getTeamDetails(teamId: string): Promise<Team | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookupteam.php?id=${teamId}`);
    const data = await response.json();
    return data.teams?.[0] || null;
  } catch (error) {
    console.error('Error fetching team details:', error);
    return null;
  }
}

export async function getUpcomingGames(): Promise<SportsEvent[]> {
  try {
    const repoGames = await SportsRepo.getUpcomingBySport('ALL', 7);
    if (repoGames.length > 0) return repoGames.map(repoGameToSportsEvent);
    if (!ENABLE_FALLBACK) return [];
    const [nflEvents, nbaEvents] = await Promise.all([
      getNextLeagueEvents(LEAGUE_IDS.NFL),
      getNextLeagueEvents(LEAGUE_IDS.NBA),
    ]);
    const allEvents = [...nflEvents, ...nbaEvents];
    allEvents.sort((a, b) => new Date(a.strTimestamp).getTime() - new Date(b.strTimestamp).getTime());
    return allEvents;
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return [];
  }
}

export async function getRecentResults(): Promise<SportsEvent[]> {
  try {
    const repoGames = await SportsRepo.getResultsBySport('ALL', 7);
    if (repoGames.length > 0) return repoGames.map(repoGameToSportsEvent);
    if (!ENABLE_FALLBACK) return [];
    const [nflEvents, nbaEvents] = await Promise.all([
      getPreviousLeagueEvents(LEAGUE_IDS.NFL),
      getPreviousLeagueEvents(LEAGUE_IDS.NBA),
    ]);
    const allEvents = [...nflEvents, ...nbaEvents];
    allEvents.sort((a, b) => new Date(b.strTimestamp).getTime() - new Date(a.strTimestamp).getTime());
    return allEvents;
  } catch (error) {
    console.error('Error fetching recent results:', error);
    return [];
  }
}

export function formatEventTime(event: SportsEvent): string {
  const date = new Date(event.strTimestamp);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return `Today ${event.strTimeLocal || event.strTime}`;
  if (diffDays === 1) return `Tomorrow ${event.strTimeLocal || event.strTime}`;
  if (diffDays < 7) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayName} ${event.strTimeLocal || event.strTime}`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatScore(event: SportsEvent): string {
  if (event.intHomeScore !== null && event.intAwayScore !== null) {
    return `${event.intHomeScore} - ${event.intAwayScore}`;
  }
  return 'vs';
}

export function getSportIcon(sport: string): string {
  switch (sport.toLowerCase()) {
    case 'american football':
      return '🏈';
    case 'basketball':
      return '🏀';
    case 'baseball':
      return '⚾';
    case 'ice hockey':
      return '🏒';
    case 'soccer':
      return '⚽';
    default:
      return '🏆';
  }
}

export async function getResultsBySport(
  sport: 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'MLS' | 'EPL' | 'ALL'
): Promise<SportsEvent[]> {
  try {
    const repoGames = await SportsRepo.getResultsBySport(sport, 7);
    if (repoGames.length > 0) return repoGames.map(repoGameToSportsEvent);
    if (!ENABLE_FALLBACK) return [];
    let events: SportsEvent[] = [];
    if (sport === 'ALL') {
      const [nfl, nba, mlb, nhl] = await Promise.all([
        getPreviousLeagueEvents(LEAGUE_IDS.NFL),
        getPreviousLeagueEvents(LEAGUE_IDS.NBA),
        getPreviousLeagueEvents(LEAGUE_IDS.MLB),
        getPreviousLeagueEvents(LEAGUE_IDS.NHL),
      ]);
      events = [...nfl, ...nba, ...mlb, ...nhl];
    } else {
      events = await getPreviousLeagueEvents(LEAGUE_IDS[sport]);
    }
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const filtered = events.filter((e) => new Date(e.strTimestamp || e.dateEvent) >= sevenDaysAgo);
    filtered.sort((a, b) => new Date(b.strTimestamp || b.dateEvent).getTime() - new Date(a.strTimestamp || a.dateEvent).getTime());
    return filtered;
  } catch (error) {
    console.error('Error fetching results by sport:', error);
    return [];
  }
}

export async function getUpcomingBySport(
  sport: 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'MLS' | 'EPL' | 'ALL'
): Promise<SportsEvent[]> {
  try {
    const repoGames = await SportsRepo.getUpcomingBySport(sport, 7);
    if (repoGames.length > 0) return repoGames.map(repoGameToSportsEvent);
    if (!ENABLE_FALLBACK) return [];
    let events: SportsEvent[] = [];
    if (sport === 'ALL') {
      const [nfl, nba, mlb, nhl] = await Promise.all([
        getNextLeagueEvents(LEAGUE_IDS.NFL),
        getNextLeagueEvents(LEAGUE_IDS.NBA),
        getNextLeagueEvents(LEAGUE_IDS.MLB),
        getNextLeagueEvents(LEAGUE_IDS.NHL),
      ]);
      events = [...nfl, ...nba, ...mlb, ...nhl];
    } else {
      events = await getNextLeagueEvents(LEAGUE_IDS[sport]);
    }
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const filtered = events.filter((e) => {
      const d = new Date(e.strTimestamp || e.dateEvent);
      return d >= now && d <= sevenDaysFromNow;
    });
    filtered.sort((a, b) => new Date(a.strTimestamp || a.dateEvent).getTime() - new Date(b.strTimestamp || b.dateEvent).getTime());
    return filtered;
  } catch (error) {
    console.error('Error fetching upcoming by sport:', error);
    return [];
  }
}

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function getResultByEventId(
  eventId: string
): Promise<{ data: SportsEvent | null; error: Error | null }> {
  try {
    if (isUuid(eventId)) {
      const canonical = await SportsRepo.getEventByCanonicalId(eventId);
      if (canonical) return { data: repoGameToSportsEvent(canonical), error: null };
    }
    const byProvider = await SportsRepo.getEventByProviderId('thesportsdb', eventId);
    if (byProvider) return { data: repoGameToSportsEvent(byProvider), error: null };
    const byEspn = await SportsRepo.getEventByProviderId('espn', eventId);
    if (byEspn) return { data: repoGameToSportsEvent(byEspn), error: null };
    if (!ENABLE_FALLBACK) return { data: null, error: null };
    const response = await fetch(`${BASE_URL}/lookupevent.php?id=${eventId}`);
    const data = await response.json();
    return { data: data.events?.[0] || null, error: null };
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return { data: null, error: error as Error };
  }
}

export const AVAILABLE_SPORTS = [
  { id: 'ALL', name: 'All Sports', icon: '🏆' },
  { id: 'NFL', name: 'NFL', icon: '🏈' },
  { id: 'NBA', name: 'NBA', icon: '🏀' },
  { id: 'MLB', name: 'MLB', icon: '⚾' },
  { id: 'NHL', name: 'NHL', icon: '🏒' },
] as const;
