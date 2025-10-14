export type OwnerId = string;
export type DivisionId = 'RIGHT_SHARKS' | 'LEFT_SHARKS';
export type TournamentId = string;
export type GolferId = string;
export type WeekId = string;

export interface Owner {
  id: OwnerId;
  name: string;
  divisionId: DivisionId;
  isCommissioner?: boolean;
}

export interface Division {
  id: DivisionId;
  name: string;
  ownerIds: OwnerId[];
}

export interface Tournament {
  id: TournamentId;
  name: string;
  startDate: string; // ISO
  endDate: string; // ISO
  isMajor: boolean; // Majors + JDC are Calcutta events
  includeInSchedule: boolean; // exclude side-by-sides/team events
}

export interface Week {
  id: WeekId;
  tournamentId: TournamentId;
  homeOwnerId: OwnerId;
  awayOwnerId: OwnerId;
  status: 'UPCOMING' | 'DRAFTING' | 'LOCKED' | 'FINAL';
  lockAt: string; // 23:59 local time day before R1
}

export interface Golfer {
  id: GolferId;
  name: string;
  worldRank?: number;
}

export interface Pick {
  weekId: WeekId;
  ownerId: OwnerId;
  golferId: GolferId;
  usageNumber: number; // 1..N (normally ≤3 unless saved)
  viaSave?: boolean; // this usage unlocked by a Save
  isProhibited?: boolean; // picked beyond allowance → $0 + fallback
}

export interface Earnings {
  tournamentId: TournamentId;
  golferId: GolferId;
  amount: number;
}

export interface SaveCredit {
  ownerId: OwnerId;
  weekIdEarned: WeekId;
  appliedToGolferId?: GolferId;
}

export interface StandingsRow {
  ownerId: OwnerId;
  divisionId: DivisionId;
  wins: number;
  losses: number;
  seasonEarnings: number;
}

export interface AuctionBid {
  ownerId: OwnerId;
  golferId: GolferId;
  amount: number;
}

export interface CalcuttaRoster {
  ownerId: OwnerId;
  golferIds: GolferId[];
  budgetRemaining: number;
}

export interface PlayoffSeed {
  seed: 1 | 2 | 3 | 4;
  ownerId: OwnerId;
  savedPlaysGranted: number;
}
