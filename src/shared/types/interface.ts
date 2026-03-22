import type {
  Battle,
  BattleParticipant,
  CrewMember,
  CrewRequest,
  SportsTeam,
} from './domain';

export type BattleStats = {
  wins: number;
  losses: number;
  challenges: number;
};

export type JoinBattleParams = {
  battleId: string;
  userId: string;
  pick: string;
};

export type CreateBattleParams = {
  creatorId: string;
  title: string;
  description?: string;
  eventId?: string;
  stake?: number;
  creatorPick?: string;
  visibility?: 'private' | 'public' | 'crew';
};

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strSport: string;
  strLeague: string;
  strStadium: string;
  strStadiumThumb: string | null;
  strDescriptionEN: string | null;
}

export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueBadge: string;
  strCountry: string;
}

export type TeamInfo = SportsTeam;

export type RepoGame = {
  id: string;
  provider: string;
  provider_event_id: string;
  sport: string;
  league: string;
  start_time: string | null;
  status: 'scheduled' | 'live' | 'final';
  home_team: string | null;
  away_team: string | null;
  home_score: number | null;
  away_score: number | null;
  home_team_abbr?: string | null;
  away_team_abbr?: string | null;
  display_name?: string | null;
  venue?: string | null;
  raw?: object;
  home_team_info?: TeamInfo | null;
  away_team_info?: TeamInfo | null;
};

export type CrewRequestWithProfile = CrewRequest & {
  sender?: CrewMember;
  receiver?: CrewMember;
};

export type BattleWithParticipants = {
  battle: Battle | null;
  participants: BattleParticipant[];
  error: unknown;
};

export type ExploreBattle = Battle & { participant_count?: number };

export type ExploreBattleRow = ExploreBattle & {
  battle_participants?: { count: number }[];
};

export type CrewMemberWithStatus = CrewMember & { requestStatus?: string };
