import { earningsData, golfersData, ownersData, weeksData } from '@/lib/data';
import type {
  AuctionBid,
  CalcuttaRoster,
  DivisionId,
  Earnings,
  Owner,
  OwnerId,
  Pick,
  PlayoffSeed,
  StandingsRow,
  Week,
  WeekId
} from '@/lib/types';

const USAGE_LIMIT = 3;

function getPicksForWeek(weekId: WeekId, picks: Pick[]) {
  return picks.filter((pick) => pick.weekId === weekId);
}

function computeUsage(ownerId: OwnerId, picks: Pick[]) {
  const usage = new Map<string, number>();
  picks
    .filter((pick) => pick.ownerId === ownerId)
    .forEach((pick) => {
      const next = (usage.get(pick.golferId) ?? 0) + 1;
      usage.set(pick.golferId, next);
    });
  return usage;
}

export function isProhibited(
  ownerId: OwnerId,
  golferId: string,
  picks: Pick[] = []
): boolean {
  const usage = computeUsage(ownerId, picks);
  return (usage.get(golferId) ?? 0) >= USAGE_LIMIT;
}

export function lockWindow(startDate: string) {
  const start = new Date(startDate);
  const lock = new Date(start.getTime());
  lock.setDate(start.getDate() - 1);
  lock.setHours(23, 59, 0, 0);
  return lock.toISOString();
}

interface WeeklyResult {
  week: Week;
  homeScore: number;
  awayScore: number;
  winner: OwnerId | null;
}

export function computeWeeklyResult(
  weekId: WeekId,
  picks: Pick[] = [],
  earnings: Earnings[] = earningsData,
  weeks: Week[] = weeksData
): WeeklyResult {
  const week = weeks.find((w) => w.id === weekId);
  if (!week) {
    throw new Error(`Unknown week ${weekId}`);
  }

  const weekPicks = getPicksForWeek(weekId, picks);
  const sumForOwner = (ownerId: OwnerId) =>
    weekPicks
      .filter((pick) => pick.ownerId === ownerId)
      .reduce((total, pick) => {
        if (pick.isProhibited) return total;
        const earning = earnings.find(
          (record) => record.tournamentId === week.tournamentId && record.golferId === pick.golferId
        );
        return total + (earning?.amount ?? 0);
      }, 0);

  const homeScore = sumForOwner(week.homeOwnerId);
  const awayScore = sumForOwner(week.awayOwnerId);
  const winner = homeScore === awayScore ? null : homeScore > awayScore ? week.homeOwnerId : week.awayOwnerId;

  return { week, homeScore, awayScore, winner };
}

export function applySave(
  ownerId: OwnerId,
  golferId: string,
  picks: Pick[] = [],
  credits: number = 0
) {
  const usage = computeUsage(ownerId, picks);
  const alreadyUsed = usage.get(golferId) ?? 0;
  if (alreadyUsed < USAGE_LIMIT) {
    throw new Error('Save can only be applied once a golfer is capped');
  }
  return credits + 1;
}

export function fallbackFieldAutoplays(
  weekId: WeekId,
  ownerId: OwnerId,
  picks: Pick[] = [],
  golfers = golfersData
) {
  const weekPicks = getPicksForWeek(weekId, picks);
  const taken = new Set(weekPicks.map((pick) => pick.golferId));
  const usage = computeUsage(ownerId, picks);
  const eligible = golfers
    .filter((golfer) => !taken.has(golfer.id) && (usage.get(golfer.id) ?? 0) < USAGE_LIMIT)
    .sort((a, b) => (a.worldRank ?? 9999) - (b.worldRank ?? 9999));
  return eligible.slice(0, 4 - weekPicks.filter((pick) => pick.ownerId === ownerId).length);
}

export function escalateAndResolveAbsent(
  weekId: WeekId,
  willingOwnerId: OwnerId,
  picks: Pick[] = [],
  owners: Owner[] = ownersData
) {
  const week = weeksData.find((w) => w.id === weekId);
  if (!week) throw new Error('Week not found');
  const opponentId = week.homeOwnerId === willingOwnerId ? week.awayOwnerId : week.homeOwnerId;
  const commissioner = owners.find((owner) => owner.isCommissioner);
  return {
    weekId,
    willingOwnerId,
    opponentId,
    commissionerId: commissioner?.id ?? null,
    status: 'FORFEIT' as const,
    fallbackGolferIds: fallbackFieldAutoplays(weekId, opponentId, picks).map((golfer) => golfer.id)
  };
}

interface AuctionState {
  bids: AuctionBid[];
  budgets: Record<OwnerId, number>;
  rosters: Record<OwnerId, string[]>;
  maxRoster: number;
}

export function runCalcuttaAuction(state: AuctionState) {
  const rosters: Record<OwnerId, string[]> = JSON.parse(JSON.stringify(state.rosters));
  const budgets = { ...state.budgets };
  const assignedGolfers = new Set<string>();

  const sortedBids = [...state.bids].sort((a, b) => b.amount - a.amount);
  const winners: CalcuttaRoster[] = [];

  sortedBids.forEach((bid) => {
    if (assignedGolfers.has(bid.golferId)) return;

    const roster = rosters[bid.ownerId] ?? [];
    if (roster.length >= state.maxRoster) return;
    if (budgets[bid.ownerId] < bid.amount) return;

    const sameHigh = sortedBids.filter((other) => other.golferId === bid.golferId && other.amount === bid.amount);
    let awarded = bid.ownerId;
    if (sameHigh.length > 1 && bid.amount === 100) {
      const dice = sameHigh.map((entry) => ({ ownerId: entry.ownerId, roll: Math.random() }));
      dice.sort((a, b) => b.roll - a.roll);
      awarded = dice[0].ownerId;
      if (awarded !== bid.ownerId) {
        return;
      }
    }

    roster.push(bid.golferId);
    rosters[bid.ownerId] = roster;
    budgets[bid.ownerId] -= bid.amount;
    assignedGolfers.add(bid.golferId);
  });

  Object.entries(rosters).forEach(([ownerId, golferIds]) => {
    winners.push({ ownerId, golferIds, budgetRemaining: budgets[ownerId] ?? 0 });
  });

  return winners;
}

function recordWinLoss(
  standings: Map<OwnerId, StandingsRow>,
  ownerId: OwnerId,
  divisionId: DivisionId,
  didWin: boolean,
  earnings: number
) {
  const row =
    standings.get(ownerId) ??
    ({ ownerId, divisionId, wins: 0, losses: 0, seasonEarnings: 0 } as StandingsRow);
  if (didWin) {
    row.wins += 1;
  } else {
    row.losses += 1;
  }
  row.seasonEarnings += earnings;
  standings.set(ownerId, row);
}

export function computeStandings(
  picks: Pick[] = [],
  earnings: Earnings[] = earningsData,
  weeks: Week[] = weeksData
): StandingsRow[] {
  const standings = new Map<OwnerId, StandingsRow>();

  weeks
    .filter((week) => week.status === 'FINAL')
    .forEach((week) => {
      const result = computeWeeklyResult(week.id, picks, earnings, weeks);
      const homeEarnings = result.homeScore;
      const awayEarnings = result.awayScore;
      const isTie = result.winner === null;
      recordWinLoss(standings, week.homeOwnerId, ownersData.find((o) => o.id === week.homeOwnerId)?.divisionId ?? 'RIGHT_SHARKS', isTie ? false : result.winner === week.homeOwnerId, homeEarnings);
      recordWinLoss(standings, week.awayOwnerId, ownersData.find((o) => o.id === week.awayOwnerId)?.divisionId ?? 'LEFT_SHARKS', isTie ? false : result.winner === week.awayOwnerId, awayEarnings);
    });

  return Array.from(standings.values());
}

function headToHeadRecord(
  ownerA: OwnerId,
  ownerB: OwnerId,
  weeks: Week[],
  picks: Pick[],
  earnings: Earnings[]
) {
  let wins = 0;
  let losses = 0;
  let earningsFor = 0;
  let earningsAgainst = 0;

  weeks
    .filter(
      (week) =>
        (week.homeOwnerId === ownerA && week.awayOwnerId === ownerB) ||
        (week.homeOwnerId === ownerB && week.awayOwnerId === ownerA)
    )
    .forEach((week) => {
      const result = computeWeeklyResult(week.id, picks, earnings, weeks);
      const isTie = result.winner === null;
      const ownerAEarnings =
        week.homeOwnerId === ownerA ? result.homeScore : result.awayScore;
      const ownerBEarnings =
        week.homeOwnerId === ownerB ? result.homeScore : result.awayScore;
      earningsFor += ownerAEarnings;
      earningsAgainst += ownerBEarnings;
      if (!isTie) {
        if (result.winner === ownerA) wins += 1;
        if (result.winner === ownerB) losses += 1;
      }
    });

  return { wins, losses, earningsFor, earningsAgainst };
}

export function applyTiebreakers(
  rows: StandingsRow[],
  picks: Pick[] = [],
  weeks: Week[] = weeksData,
  earnings: Earnings[] = earningsData
) {
  const rowsCopy = [...rows];
  rowsCopy.sort((a, b) => {
    if (a.wins !== b.wins) return b.wins - a.wins;
    const head = headToHeadRecord(a.ownerId, b.ownerId, weeks, picks, earnings);
    const headWins = head.wins - head.losses;
    if (headWins !== 0) return headWins;
    const divisionRecordA = rows.filter((row) => row.divisionId === a.divisionId);
    const divisionRecordB = rows.filter((row) => row.divisionId === b.divisionId);
    const divisionWinsA = divisionRecordA.reduce((acc, row) => acc + row.wins, 0);
    const divisionWinsB = divisionRecordB.reduce((acc, row) => acc + row.wins, 0);
    if (divisionWinsA !== divisionWinsB) return divisionWinsB - divisionWinsA;
    const headEarnings = head.earningsFor - head.earningsAgainst;
    if (headEarnings !== 0) return headEarnings;
    if (a.seasonEarnings !== b.seasonEarnings) return b.seasonEarnings - a.seasonEarnings;
    return 0;
  });
  return rowsCopy;
}

export function seedPlayoffs(
  rows: StandingsRow[],
  picks: Pick[] = [],
  weeks: Week[] = weeksData,
  earnings: Earnings[] = earningsData
): PlayoffSeed[] {
  const standings = applyTiebreakers(rows, picks, weeks, earnings);

  const divisionWinners: StandingsRow[] = [];
  ['RIGHT_SHARKS', 'LEFT_SHARKS'].forEach((division) => {
    const divisionRows = standings.filter((row) => row.divisionId === division);
    if (divisionRows.length) {
      divisionWinners.push(divisionRows[0]);
    }
  });

  const remaining = standings.filter((row) => !divisionWinners.some((winner) => winner.ownerId === row.ownerId));
  const wildcards = [...remaining].sort((a, b) => b.seasonEarnings - a.seasonEarnings).slice(0, 2);

  const seeds: PlayoffSeed[] = [];
  const sortedDivisionWinners = [...divisionWinners].sort((a, b) => b.wins - a.wins);
  sortedDivisionWinners.forEach((row, index) => {
    seeds.push({ seed: (index + 1) as 1 | 2, ownerId: row.ownerId, savedPlaysGranted: 0 });
  });

  wildcards.forEach((row, index) => {
    seeds.push({ seed: ((index + 3) as 3 | 4), ownerId: row.ownerId, savedPlaysGranted: 0 });
  });

  return seeds;
}

export function grantPlayoffSaves(seeds: PlayoffSeed[]): PlayoffSeed[] {
  return seeds.map((seed) => {
    const grants = { 1: 4, 2: 3, 3: 2, 4: 1 } as const;
    return { ...seed, savedPlaysGranted: grants[seed.seed] };
  });
}
